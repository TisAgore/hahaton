/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('requests', {
        requestId:           {
            type:       'bigserial',
            primaryKey: true,
        },
        workshopId:{
            type:'bigint',
            comment:'Номер цеха, с которого пришло уведомление'
        },
        lineId:{
            type:'bigint',
            comment:'Номер линии, с которой пришло уведомление'
        },
        requestPriority:{
            type:'int',
            comment:'Приоритет заявки\n1 - просто уведомление\n2 - предупреждение\n3 - фатальная ошибка'
        },
        requestSensors:{
            type:'jsonb',
            comment:'Объект с информацией по датчикам'
        }
    }, {
        ifNotExists: true,
        comment:'Сотрудники'
    });
};

exports.down = pgm => {
};