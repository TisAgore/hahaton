<template>
  <q-page>
        <div class="q-pa-md">
        <div>
            <q-btn class="button" color="secondary" @click="showWindow">Добавить пользователя</q-btn>
            <q-dialog v-model="showDialog">
            <q-card>
                <q-card-section>
                   Добавьте пользователя
                </q-card-section>
                <q-card-section>
                    <q-input class="input_body" standout="bg-secondary text-white" v-model="message.email" label="Email" />
                    <q-input class="input_body" standout="bg-secondary text-white" v-model="message.phone" label="Номер телефона" />
                    <q-input class="input_subject" standout="bg-secondary text-white" v-model="message.subject" label="ФИО" />
                    <q-input class="input_body" standout="bg-secondary text-white" v-model="message.shop" label="Номер цеха" />
                    <q-input class="input_body" standout="bg-secondary text-white" v-model="message.plot" label="Номер участка" />
                    галочки
                </q-card-section>
                <q-card-actions>
                <q-btn color="secondary" label="Закрыть" @click="closeWindow" />
                <q-btn class="button_add" color="secondary" label="Добавить" @click="addMessage"></q-btn>
                </q-card-actions>
            </q-card>
            </q-dialog>
        </div>
        <q-table
            title="Шаблон сообщений"
            :data="data"
            :columns="columns"
            row-key="name"
        />
        </div>  
    </q-page>
</template>

<script>
export default {
    
    data () {
        return { 
            showDialog: false,
            data: [],
            message: {
                subject: '',
                email: '',
                phone: '',
                shop: null,
                plot: null,
                sensor: null,
            },
            columns: [
                {
                name: 'name',
                required: true,
                label: 'Номер',
                align: 'left',
                field: row => row.name,
                format: val => `${val}`,
                },
                { name: 'email', align: 'center', label: 'Email', field: 'email'} ,
                { name: 'Phone', label: 'Номер телефона', field: 'phone'},
                { name: 'FIO', label: 'ФИО', field: 'FIO' },
                { name: 'Number_shop', label: 'Номер цеха', field: 'Number_shop' },
                { name: 'Number_plot', label: 'Номер участка', field: 'Number_plot' },
                // { name: 'Number_plot', label: 'Номер участа', field: 'Number_plot' },
            ],
            // options: [
            //     {
            //         sensorName: 'Датчик температуры',
            //     }
            // ],
        };
    },
    methods: {
        showWindow() {
        this.showDialog = true;
        },
        closeWindow() {
        this.showDialog = false;
        this.message.subject = '';
        this.message.body = '';
        this.message.sensor = null;
        },
        async addMessage(message) {
            const request1 = {
                "userFio": message.subject,
                "userEmail": message.email,
                "userPhone": message.phone,
            }
            const request2 = {
                "lineId": message.plot,
                "workshopId": message.shop
            }
            try {
                const response1 = await axios.post('http://localhost:3000/users/insert', request1)
                const response2 = await axios.post('http://localhost:3000/userlines/insert', request2)
                console.log(response1.data, response2.data)
                // message.messageId = response
                this.data.push({
                    name: this.data.length + 1,
                    ...message,
                })
                this.closeWindow()
            }
            catch(error) {
                console.error(error)
            }
        },
    },
}
</script>

<style>
.button{
    margin-top: 3vh;
    margin-bottom: 5vh;
}
.input_subject{
    margin-bottom: 2vh;
}
.input_body{
    margin-bottom: 2vh;
}
</style>    