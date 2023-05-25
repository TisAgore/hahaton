/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('messages', {
        messageId:           {
            type:       'bigserial',
            primaryKey: true,
        },
        workshopId:{
            type:'bigint',
            comment:'Номер цеха'
        },
        lineId:{
            type:'bigint',
            comment:'Номер линии'
        },
        sensorId:{
            type:'bigint',
            comment:'Номер датчика'
        },
        messageText:{
            type:'varchar(700)',
            comment:'Текст отправленного сообщения'
        },
        messageTitle:{
            type:'varchar(500)',
            comment:'Тема сообщения'
        },
        messageType:{
            type:'int',
            comment:'Куда отправили\n1 - почта\n2 - смс\n3 - телега'
        }
    }, {
        ifNotExists: true,
        comment:'Сотрудники'
    });
};

exports.down = pgm => {
};