const axios = require("axios")
const nodemailer = require('nodemailer')


/**
 * 
 * @param {Object} object
 * @param {Array | null}  object.file
 * @param {String}  object.file.filePath
 * @param {String}  object.file.fileName
 * @param {String}  object.subject
 * @param {String}  object.userEmail
 * @param {String}  object.text
 */

const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: '587',
    auth: {
        user: 'UltiSuper@yandex.ru',
        pass: 'Nfyr421387Y'
    }
})
async function sendEmail (object) {
    try{
        const emailObject = {
            subject: object.messageTitle,
            from: 'UltiSuper@yandex.ru',
            to: object.userEmail,
            html: object.messageText
        }

        await transporter.sendMail(emailObject)
    }
    catch (e) {
        console.log(e)
    }
}

async function getRequest() {
    try {
        const requests = await axios.post('http://127.0.0.1:3000/select', {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        })
        console.log(requests.data)
        const messages = await axios.post('http://127.0.0.1:3000/messagetemplates/select', {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
        })
        let array = []
        for (let message of messages.data.message) {
            for (let request of requests.data.message) {
                console.log(message, request, messages.data.message.indexOf(message))
                if (message.sensorId==request.sensorId) {
                    array.push(message)
                }
            }
        }
        console.log(array)
        let workshopId = 0
        let sensorId = 0
        let line = []
        let workshop = []
        let index = 0
        let body = 0
        for (let element of array) {
            sensorId = {'sensorId': element.sensorId}
            const res1 = await axios.post('http://127.0.0.1:3000/lines/select', sensorId, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
            })
            line.push(res1.data.message[0])

            index = array.indexOf(element)
            console.log(line)
            workshopId = line[index]
            const res2 = await axios.post('http://127.0.0.1:3000/workshops/select', workshopId, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
            })
            workshop.push(res2.data.message[0])

            body = {
                'messageText': element.messageText,
                'messageTitle': element.messageTitle,
                'sensorId': element.sensorId,
                'lineId': line[index].lineId,
                'workshopId': workshop[index].workshopId,
                'isSms': element.isSms,
                'isEmail': element.isEmail
            }
            
            const message = await axios.post('http://127.0.0.1:3000/messages/insert', body, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
            })
            let userId = {'userId': element.userId}
            const user = await axios.post('http://127.0.0.1:3000/user/select', userId, {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
            })
            let userdata = user.data.message
            let phone = userdata.userPhone
            let code = element.messageTitle + '\n' + element.messageText
            let id = process.env.SMS_ID
            const response = await fetch('https://sms.ru/sms/send?api_id=' + id + '&to=' + phone + '&msg=' + code + '&json=1&from=vdelo');
                d = await response.text();
                console.log(d);
                d = JSON.parse(d);
                console.log(d);
            // console.log(line, workshop, message.data)
            // console.log(message)
            
            let email = userdata.userEmail
            let messageBody = {
                "messageTitle": body.messageTitle,
                "messageText": body.messageText,
                "userEmail": email
            }
            sendEmail(messageBody)
        }
        await axios.post('http://127.0.0.1:3000/statistics/update')
    } catch(error) {
        console.error(error)
    }
}

// async function sendMessage() {
//     const requests = getRequest()
//     console.log(requests)
//     let sensorId = requests.sensorId
//     const messages = await axios.post('http://127.0.0.1:3000/users/select', {
//         headers: {
//             'Access-Control-Allow-Origin': '*'
//         },
//     })
//     // console.log(messages)
// }

getRequest()