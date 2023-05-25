<template>
    <q-page>
        <div class="q-pa-md">
        <div>
            <q-btn class="button" color="secondary" @click="showWindow">Добавить сообщение</q-btn>
            <q-dialog v-model="showDialog">
            <q-card>
                <q-card-section>
                   Добавьте сообщение 
                </q-card-section>
                <q-card-section>
                    <q-input class="input_subject" standout="bg-secondary text-white" v-model="message.subject" label="Тема сообщения" />
                    <q-input class="input_body" standout="bg-secondary text-white" v-model="message.body" label="Тело сообщения" />
                    <q-select
                        filled
                        v-model="message.sensor"
                        multiple
                        :options="options"
                        option-label="sensorName"
                        label="Датчик"
                        style="width: 250px"
                        standout="bg-secondary"
                    />
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
            body: '',
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
            { name: 'Subject', align: 'center', label: 'Тема сообщения', field: 'subject'},
            { name: 'Body', label: 'Тело сообщения', field: 'body'},
            { name: 'Sensor', label: 'Датчик', field: 'sensor' },
        ],
        options: [
            {
                sensorName: 'Датчик температуры',
                sensorName: 'Датчик давления',
                sensorName: 'Датчик 3'
            }
        ],
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
            const request = {
                "messageText": message.body,
                "messageTitle": message.subject,
                "sensorId": message.sensor,
            }
            try {
                const users = await axios.post('http://localhost:3000/users/select')
                let userMessage = users.data.message
                let isSms = false
                let isEmail = false
                if (userMessage.userPhone != null && userMessage.userPhone != undefined) {
                    isSms = true
                }
                if (userMessage.userEmail != null && userMessage.userEmail != undefined) {
                    isEmail = true
                }
                let useId = userMessage.userId
                request["isSms"] = isSms
                request["isEmail"] = isEmail
                request["userId"] = userId
                const response = await axios.post('http://localhost:3000/messagetemplates/insert', request)
                console.log(response.data)
                // message.messageId = response
                this.data.push({
                    name: this.data.length + 1,
                    ...response.data.message,
                })
                this.closeWindow()
            }
            catch(error) {
                console.error(error)
            }
            this.data.push({
                name: this.data.length + 1,
                ...this.message,
            })
            this.closeWindow();
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