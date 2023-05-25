require( 'dotenv' ).config();
const { pool } = require( './postgresql' )
const fastify = require( 'fastify' )( {
    logger:true,
} );

fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})

// Создание маршрута для get запроса
fastify.get( '/', async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const result = await client.query( `select *
                                            from "таблица"
                                            where "условие" = $1`, [ 'параметр, по которому фильтруем' ] )
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
} )

// Создание маршрута для post запроса
fastify.post('/insert', async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        let body = request.body
        const result = await client.query( `insert into requests ("workshopId", "lineId", "sensorId", "value") values ($1,$2,$3,$4) returning "requestId"`, 
                                        [ body.workshopId, body.lineId, body.sensorId, body.value ] )
        // console.log(body)
        const workshops = await client.query('select "workshopId" from workshops')
        const lines = await client.query('select "lineId" from lines')
        const sensors = await client.query('select "sensorId" from sensors')
        console.log(sensors)
        // let workshopRow = { workshopId: body.workshopId }
        // let lineRow = { lineId: body.lineId }
        // let sensorRow = { sensorId: body.sensorId }
        let minV = 0
        let maxV = 0
        // console.log(workshops.rows.some((workshop) => {
        //     console.log(workshop, workshopRow)
        //     console.log(workshop == workshopRow)
        // }))
        // console.log()
        if (workshops.rows.some((workshop) => workshop.workshopId == body.workshopId) == false) {
            const workshop = await client.query('insert into workshops ("workshopId") values ($1) returning "workshopId"', [body.workshopId])
        }
        if (lines.rows.some((line) => line.lineId == body.lineId) == false) {
            const line = await client.query('insert into lines ("lineId", "workshopId") values ($1, $2) returning "lineId"',
                                            [body.lineId, body.workshopId])
        }
        if (sensors.rows.some((sensor) => sensor.sensorId == body.sensorId) == false) {
            if (body.sensorId%3 == 1) {
                minV = 60
                maxV = 120
            } else if (body.sensorId%3 == 2) {
                minV = 1200
                maxV = 2300
            } else {
                minV = 3
                maxV = 6
            }
            const sensor = await client.query('insert into sensors("sensorId", "lineId", "sensorMinValue", "sensorMaxValue") values ($1, $2, $3, $4) returning "sensorId"',
                                                [body.sensorId, body.lineId, minV, maxV])
            console.log(sensor)
        }
        if(result.rowCount > 0){
            console.log(`Успешно добавили запись`)
            data.message = {
                id:result.rows[0].id
            }
        }
        else{
            console.log(`Ошибка при добавлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/users/insert', async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
        const client = await pool.connect()
    try {
        const result = await client.query('insert into users ("userFio", "userEmail", "userPhone") values ($1, $2, $3) returning "userId"',
                                            [request.body.userFio, request.body.userEmail, request.body.userPhone])
        if(result.rowCount > 0){
            console.log(`Успешно добавили запись`)
            data.message = {
                id:result.rows[0].id
            }
        }
        else{
            console.log(`Ошибка при добавлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/userlines/insert', async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
        const client = await pool.connect()
    try {
        const result = await client.query('insert into userlines ( "lineId", "workshopId") values ($1, $2) returning "userId"',
                                            [request.body.lineId, request.body.workshopId])
        if(result.rowCount > 0){
            console.log(`Успешно добавили запись`)
            data.message = {
                id:result.rows[0].id
            }
        }
        else{
            console.log(`Ошибка при добавлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/messagetemplates/insert', async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
        const client = await pool.connect()
    try {
        let body = request.body
        const result = await client.query('insert into messagetemplates ("messageText", "messageTitle", "sensorId", "userId", "isSms", "isEmail") values ($1, $2, $3, $4, $5, $6) returning "messageTemplateId"',
                                            [body.messageText, body.messageTitle, body.sensorId, body.userId, body.isSms, body.isEmail])
        console.log(body)
        if(result.rowCount > 0){
            console.log(`Успешно добавили запись`)
            data.message = result.data
        }
        else{
            console.log(`Ошибка при добавлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/messages/insert', async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
        const client = await pool.connect()
    try {
        let body = request.body
        const result = await client.query('insert into messages ("messageText", "messageTitle", "sensorId", "lineId", "workshopId", "isSms", "isEmail") values ($1, $2, $3) returning "messageId"',
                                            [body.messageText, body.messageTitle, body.sensorId, body.lineId, body.workshopId, body.isSms, body.isEmail])
        console.log(body)
        if(result.rowCount > 0){
            console.log(`Успешно добавили запись`)
            data.message = result.data
        }
        else{
            console.log(`Ошибка при добавлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/select',async function (reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `select "requestId", requests."sensorId", "done" from requests
                                            inner join sensors on requests."sensorId"=sensors."sensorId" and requests."done"=false
                                            where requests."value" < sensors."sensorMinValue" or requests."value" > sensors."sensorMaxValue"`)
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})


fastify.post('/users/select',async function (reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `select "userFio", "userEmail", "userPhone", "lineId", "workshopId", "sensotId", "userId" from users
                                            inner join userlines on users."userId"=userlines."userId"`)
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/messagetemplates/select',async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `select "userId", "messageText", "messageTitle", "isSms", "isEmail", "sensorId" from messagetempaltes`)
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/messagetemplates/select',async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `select "userId", "messageText", "messageTitle", "isSms", "isEmail", "sensorId" from messagetempaltes`)
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/user/select',async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `select "userId", "messageText", "messageTitle", "isSms", "isEmail", "sensorId" from users`)
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/lines/select',async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `select "lineId" from sensors where "sensorId"=$1`, [request.body.sensorId])
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/workshops/select',async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `select "workshopId" from lines where "lineId"=$1`, [request.body.lineId])
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

fastify.post('/update',async function (request, reply) {
    let data = {
        message:   'error',
        statusCode:400
    }
    const client = await pool.connect()
    try {
        const requests = await client.query( `update requests set "done"=true`)
        console.log(requests)

        if(requests.rowCount > 0){
            console.log(`Успешно обновили запись`)
            data.message = requests.rows
        }
        else{
            console.log(`Ошибка при обновлении записи`)
        }
    }
    catch ( e ) {
        console.log( e )
        data.message = 'Ошибка при выполнении запроса' + e.message
    }
    finally {
        client.release()
    }
    reply.send( data )
})

// Создание запроса с использование path параметров
fastify.get('/:id',function (request, reply) {
    console.log(`Path параметры, переданные в запросе: `,JSON.stringify(request.params))
    reply.send(request.params)
})

// Создание запроса с использованием query параметров
fastify.get('/query',function (request, reply) {
    console.log(`Query параметры, переданные в запросе`, JSON.stringify(request.query))
    reply.send(request.query)
})

fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})