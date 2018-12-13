/**
 * @api {POST} /authenticate Get Token
 * @apiGroup Authentication
 *
 * @apiParam {String} email Users email address
 * @apiParam {String} password Users password
 *
 * @apiSuccess {String} token Used for Authorization header on request
*/

/**
 * @api {GET} /:table/:id Get Entity
 * @apiGroup Entities
 *
 * @apiParam (Query) {String} table Specify database table/collection
 * @apiParam (Query) {String} [id] Pass it on /getEntity/:table/:id if you want to return specific data
 *
 * @apiParam (Body) {Object} [filter] Pass specific attributes to return filtered queries. e.g. { address: "Makati"}
 * @apiParam (Body) {Object} [fields] Pass this to return specific attributes that you only need. e.g. ["Name", "Address"] returns [{Name: "", Address: ""}, ...{ and_so_on }] only
 * 
 * @apiHeader {String} Authorization Insert generated token here to validate request.
 * 
 * @apiSuccess {Number} length Length of the response
 * @apiSuccess {Object} lists Response content
 * 
*/

/**
 * @api {POST} /:table Post Entity
 * @apiGroup Entities
 *
 * @apiParam (Query) {String} table Specify database table/collection
 *
 * @apiParam (Body) {Object} formData All things to be added
 * 
 * @apiHeader {String} Authorization Insert generated token here to validate request.
 * 
 * @apiSuccess {Number} length Length of the response
 * @apiSuccess {Object} lists Response content
 * 
*/

/**
 * @api {PUT} /:table/:id Put Entity
 * @apiGroup Entities
 *
 * @apiParam (Query) {String} table Specify database table/collection
 * @apiParam (Query) {String} id Specify id to be edited
 *
 * @apiParam (Body) {Object} formData Payload object that determines all fields to be edited
 * 
 * @apiHeader {String} Authorization Insert generated token here to validate request.
 * 
 * @apiSuccess {Number} length Length of the response
 * @apiSuccess {Object} lists Response content
 * 
*/

/**
 * @api {DELETE} /:table/:id Delete Entity
 * @apiGroup Entities
 *
 * @apiParam (Query) {String} table Specify database table/collection
 * @apiParam (Query) {String} id Specify id to be deleted
 *
 * @apiHeader {String} Authorization Insert generated token here to validate request.
 * 
 * @apiSuccess {String} id Deleted object id
 * 
*/