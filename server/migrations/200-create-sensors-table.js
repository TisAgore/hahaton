/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('sensors', {
        sensorId:           {
            type:       'bigserial',
            primaryKey: true,
        },
        lineId:{
            type:'bigint',
            comment:'Номер линии, к которой привязан датчик'
        },
        sensorValue:         {
            type: 'numeric(30,2)',
            comment:'Эталонное значение датчика'
        },
    }, {
        ifNotExists: true,
        comment:'Датчики'
    });
};

exports.down = pgm => {
};