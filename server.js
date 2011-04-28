var connect = require('connect');
var appSchema = require('./node_modules/app.schema.js');
var port = 8665;

var restServer = connect.createServer(
        connect.bodyParser(),
        connect.router(function(restApp) {
        var models = appSchema.getModels();          
        
        function responseHandler(res, data) {            
            var jsonData = JSON.stringify(data);
            res.writeHead(400, { 'Content-Type': 'application/json',
                         'Content-Length':jsonData.length ? jsonData.length : 0 });
            res.end(jsonData);
          }
// AUTHENTICATION
// - LOGIN
// - LOGOUT

//--VOTES
//READ          
          restApp.get('/remark/:id?', function(req, res) {
            var query = {};
            if(req.params.id){
              query._id = req.params.id;
            }
            
            models.Record.find(query, function(error, records) {
              var output;
              if(error){
                output = {result : 'could not get record(s)', error : error};
              }
              else{
                output = records;
              }
              responseHandler(res, output);
            });
          });
//CREATE          
          restApp.post('/remark', function(req, res) {
            var record = new models.Record(req.body);
            record.save(function(error) {
              if(error){
                responseHandler(res, {result : 'model save failed', error : error});
                return;
              }
              responseHandler(res, record);
            });
          });
//UPDATE          
          restApp.put('/remark/:id', function(req, res) {
            var id = req.params.id;
            var recordUpdates = req.body;
            models.Record.findOne({_id : id}, function(err, record){
              if(!recordUpdates._id || recordUpdates._id != id){
                responseHandler(res, {error: 'the record id is either missing or does not match the specified ' +
                    'record id to update'});
                return;
              }
              if(err || record === null){
                responseHandler(res, {error: 'could not update record : id did not match any object id'});
              }
              else{
                record.title = recordUpdates.title;
                record.detail = recordUpdates.detail;
                record._updated = new Date();
                record.save(function(error){

                  if(error){
                    responseHandler(res, {error: 'could not update record : save failed'});
                    return;
                  }
                  responseHandler(res, record);
                });
              }
            });
          });
          
//DELETE
          restApp['delete']('/remark/:id', function(req, res) {

            var id = req.params.id;

            models.Record.findOne({_id : id}, function(err, record){
              if(!record){
                responseHandler(res, {error: 'no record found.'});
                return;
              }

              if(err){
                responseHandler(res, {error: error});
              }
              else{
                record.remove(function(error){
                  if(error){
                    responseHandler(res, {error: 'could not delete record : remove failed'});
                    return;
                  }
                  responseHandler(res, {result : 'record deleted'});
                });
              }
            });
          });
//VOTES
// - UP
//          restApp.post('/vote/up/id', function(req, res) {
// - DOWN
//          restApp.post('/vote/down/id', function(req, res) {



        })).listen(port);


console.log('server started and listening on port :' + port);
