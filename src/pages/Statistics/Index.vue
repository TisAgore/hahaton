<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        title="Статистика сообщений"
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
          columns: [
              {
              name: 'name',
              required: true,
              label: 'ФИО',
              align: 'left',
              field: row => row.name,
              format: val => `${val}`,
              },
              { name: 'WorkShop', align: 'center', label: 'Цех', field: 'WorkShop'},
              { name: 'Line', label: 'Участок', field: 'Line'},
              { name: 'Sensor', label: 'Датчик', field: 'Sensor' },
              { name: 'Text', label: 'Тело сообщения', field: 'Text' },
              { name: 'Title', label: 'Заголовок', field: 'Title' },
              { name: 'Sms', label: 'Sms', field: 'Sms'},
              { name: 'Email', label: 'Email', field: 'Email'}
          ],
          data: [
            messages
          ]
        // leftDrawerOpen: false,
        // essentialLinks: linksData
      }
    },
    methods: {
      async getStatistics() {
        try {
          const response = await axios.post('http://localhost:3000/statistics/select')
          console.log(response)
          this.messages = response.data.message
        } catch(error) {
          console.error(error)
        }
      }
    },
    async created() {
      await this.getStatistics()
    }
}
</script>

<style>

</style>