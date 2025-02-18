<template>

  <div class="dashboard-container">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Cargando...</span>
      </div>
      <p>Cargando alertas...</p>
    </div>

    <div>
      <div v-if="!showAddAlert && !selectedAlert" class="row justify-content-center mb-5">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card-body">
            <div class="input-group input-group-lg">
              <div class="input-group-prepend">
                <span class="input-group-text bg-white border-right-0">
                  <i class="fas fa-search text-primary"></i>
                </span>
              </div>
              <input v-model="searchTerm" type="text" class="form-control border-left-0 pl-0"
                placeholder="Buscar alertas por nombre de pacientes" style="border-left: none; box-shadow: none;">
              <button @click="toggleAddAlert" class="btn btn-light ml-3 add-alert-btn" title="Añadir Alerta">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-0">
        <!-- Calendario -->
        <div v-if="showAddAlert || selectedAlert" class="col-xl-4">

        </div>
        <div :class="showAddAlert || selectedAlert ? 'col-xl-4' : 'col-xl-5'">
          <VCalendar style="width: 100%" v-model:date="selectedDate" :attributes="calendarAttributes"
            @dayclick="onDateSelect" :initial-date="selectedDate" />
        </div>
        <div v-if="showAddAlert || selectedAlert" class="col-xl-4"></div>


        <!-- Tabla de Alertas -->
        <div :class="showAddAlert || selectedAlert ? 'col-xl-8 mt-3' : 'col-xl-7'">
          <div class="card ">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="card-title mb-0">Alertas del {{ formatDate(selectedDate) }}</h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-4">#</th>
                      <th>Título</th>
                      <th>Paciente</th>
                      <th>Hora</th>
                      <th>Operador</th>
                      <th>Zona</th>
                      <th class="text-center">Tipo</th>
                      <th class="text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="alert in getPaginatedAlerts()" :key="alert.id" @click="selectAlert(alert)"
                      class="alert-row">
                      <td class="ps-4">{{ alert.id }}</td>
                      <td class="text-wrap" style="max-width: 200px;">
                        <div class="text-truncate" :title="alert.title">{{ alert.title }}</div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center" v-if="alert.patient">
                          {{ alert.patient.fullName }}
                          <a :href="`/calls/new-with-alert/${alert.id}`"><i v-if="!getCallByAlertId(alert.id)" class="fas fa-phone-alt ml-2" title="Ver llamada"></i></a>
                          <a :href="`/calls/edit/${getCallByAlertId(alert.id)}`"><i v-if="getCallByAlertId(alert.id)" class="fas fa-pencil-alt ml-2" title="Editar llamada"></i></a>
                        </div>
                        <span v-else class="text-muted">Sin paciente asignado</span>
                      </td>
                      <td>{{ formatDateTime(alert.date, alert.time) }}</td>
                      <td>
                        <div class="d-flex align-items-center" v-if="alert.operator">
                          {{ alert.operator.name }}
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center" v-if="alert.zone">
                          <a :href="`/patients/zones/${alert.zone.id}`">{{ alert.zone.name }}</a>
                        </div>
                        <div v-else>
                          N/A
                        </div>
                      </td>
                      <td class="text-center">
                        <span class="badge rounded-pill" :class="getAlertTypeBadgeClass(alert.type)">
                          {{ getAlertTypeLabel(alert.type) }}
                        </span>
                      </td>
                      <td class="text-center">
                        <span class="badge rounded-pill" :class="alert.isActive ? 'bg-success' : 'bg-secondary'">
                          {{ alert.isActive ? 'Activa' : 'Inactiva' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>


            </div>

          </div>

          <div v-if="!isLoading && selectedDate" class="pagination-container mt-4 mb-4">
            <nav class="pagination" role="navigation" aria-label="pagination">
              <button class="pagination-button" :disabled="currentPage === 1" @click="changePage(currentPage - 1)"
                aria-label="Previous page">
                <i class="fas fa-chevron-left"></i>
              </button>

              <button v-for="pageNumber in getDisplayedPageNumbers()" :key="pageNumber" @click="changePage(pageNumber)"
                :class="['pagination-button', { 'is-current': pageNumber === currentPage }]"
                :aria-label="`Page ${pageNumber}`" :aria-current="pageNumber === currentPage ? 'page' : undefined">
                {{ pageNumber }}
              </button>

              <button v-if="showEllipsisEnd()" class="pagination-ellipsis" disabled>
                <span>&hellip;</span>
              </button>

              <button class="pagination-button" :disabled="currentPage === getTotalPages()"
                @click="changePage(currentPage + 1)" aria-label="Next page">
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>

        <!-- Formulario -->
        <div v-if="showAddAlert || selectedAlert != null" class="col-xl-4 mt-3 pb-5">
          <AddAlert v-if="showAddAlert" @alert-added="handleAlertAdded" @close="closeAddAlert" />
          <AddAlert v-else :editingAlert="selectedAlert" @alert-updated="handleAlertUpdated" @close="closeAddAlert" />

          <div v-if="!showAddAlert" class="d-flex flex-column flex-md-row justify-content-end mt-3 gap-2 mr-2 text-md-right">
            <div :class="idRelatedCall ? 'mr-md-2' : ''">
              <router-link :to="{ name: 'callsNewWithAlert', params: { alertId: selectedAlert.id } }"
                class="btn btn-primary d-flex align-items-center mb-2 mb-md-0">
                Nueva llamada con alerta
                <i class="fas fa-phone-alt ml-2"></i>
              </router-link>
            </div>

            <div>
              <router-link v-if="idRelatedCall" :to="{ name: 'edit call', params: { callId: idRelatedCall } }"
                class="btn btn-secondary d-flex align-items-center">
                Editar llamada relacionada
                <i class="fas fa-edit ml-2"></i>
              </router-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>


</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCounterStore } from '@/stores/index.js';
import { Calendar } from 'v-calendar';
import 'v-calendar/dist/style.css';
import AddAlert from '@/components/views/adds/AddAlert.vue'
import CallsRepository from '@/repositories/calls.repository';

export default {
  name: 'AlertsCalendarView',
  components: {
    VCalendar: Calendar,
    AddAlert
  },
  data() {
    return {
      dateNow: new Date(),
      selectedDate: null,
      selectedAlert: null,
      editingAlert: null,
      showAddAlert: false,
      searchTerm: '',
      isLoading: true,
      allAlerts: [],
      currentPage: 1,
      itemsPerPage: 5,
      callRepository: new CallsRepository(),
      idRelatedCall: null,
    };
  },
  computed: {
    ...mapState(useCounterStore, ['alerts','getCallByAlertId']),
    filteredAlerts() {
      if (!this.selectedDate) return [];
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      return this.allAlerts.filter(alert => {
        const alertDate = new Date(alert.date);
        const dateMatch = (
          alertDate.getDate() === this.selectedDate.getDate() &&
          alertDate.getMonth() === this.selectedDate.getMonth() &&
          alertDate.getFullYear() === this.selectedDate.getFullYear()
        );
        const searchMatch = !searchTermLower || (alert.patient && alert.patient.fullName.toLowerCase().includes(searchTermLower));
        return dateMatch && searchMatch;
      });
    },
    calendarAttributes() {
      const groupedAlerts = this.groupAlertsByDate();
      return Object.entries(groupedAlerts).map(([dateString, alerts]) => ({
        dates: new Date(dateString),
        dot: this.getAlertTypeDotClass(alerts[0])
      }));
    }
  },
  methods: {
    ...mapActions(useCounterStore, ['loadAlerts', 'loadCalls', 'getAlertTypeBadgeClass', 'getAlertTypeLabel', 'formatRecurringDays']),
    formatDate(date) {
      if (!date) return '';
      return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    formatDateTime(date, time) {
      const datetime = new Date(`${date}T${time}`);
      return datetime.toLocaleString();
    },
    onDateSelect(date) {
      this.selectedDate = date.date;
      // this.selectedAlert = null;
      this.showAddAlert = false;
      this.currentPage = 1;
    },
    async selectAlert(alert) {
      if (this.selectedAlert === alert) {
        this.selectedAlert = null;
      } else {
        this.selectedAlert = alert;
        await this.firstRelatedCall();

      }
      // this.selectedAlert = alert;
      this.showAddAlert = false;
    },
    toggleAddAlert() {
      //  console.log('toggleAddAlert ' + this.showAddAlert);
      this.showAddAlert = !this.showAddAlert;
      this.selectedAlert = null;
      this.editingAlert = null;
    },
    closeAddAlert() {
      this.showAddAlert = false;
      this.editingAlert = null;
      this.selectedAlert = null;
    },
    async handleAlertAdded(newAlert) {
      this.showAddAlert = false;
      this.editingAlert = null;
      await this.loadAlerts();
      this.isLoading = true;
      await this.loadAlerts();
      this.allAlerts = this.alerts;

      this.allAlerts = this.processRecurringAlerts(this.alerts);
      this.isLoading = false;
    },
    async handleAlertUpdated(updatedAlert) {
      this.showAddAlert = false;
      this.editingAlert = null;
      const index = this.allAlerts.findIndex(a => a.id === updatedAlert.id);
      if (index !== -1) {
        this.allAlerts[index] = updatedAlert;
      }
      this.isLoading = true;
      await this.loadAlerts();
      this.allAlerts = this.alerts;

      this.allAlerts = this.processRecurringAlerts(this.alerts);
      this.isLoading = false;

    },
    groupAlertsByDate() {
      const grouped = {};
      this.allAlerts.forEach(alert => {
        const dateString = new Date(alert.date).toDateString();
        if (!grouped[dateString]) {
          grouped[dateString] = [alert];
        } else {
          grouped[dateString].push(alert);
        }
      });
      return grouped;
    },
    getPaginatedAlerts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAlerts.slice(start, end);
    },
    getTotalPages() {
      return Math.ceil(this.filteredAlerts.length / this.itemsPerPage);
    },
    changePage(page) {
      if (page >= 1 && page <= this.getTotalPages()) {
        this.currentPage = page;
      }
    },
    getDisplayedPageNumbers() {
      const displayed = [];
      const totalDisplayed = 5;
      const totalPages = this.getTotalPages();

      if (totalPages <= totalDisplayed) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      displayed.push(1);

      let start = Math.max(2, this.currentPage - Math.floor(totalDisplayed / 2));
      let end = Math.min(totalPages - 1, start + totalDisplayed - 3);

      if (end === totalPages - 1) {
        start = Math.max(2, end - totalDisplayed + 3);
      }

      if (start > 2) {
        displayed.push('...');
      }

      for (let i = start; i <= end; i++) {
        displayed.push(i);
      }

      if (end < totalPages - 1) {
        displayed.push('...');
      }

      displayed.push(totalPages);

      return displayed;
    },
    showEllipsisEnd() {
      return this.getTotalPages() > 5 && !this.getDisplayedPageNumbers().includes(this.getTotalPages() - 1);
    },
    getAlertTypeDotClass(alert) {
      const classes = {
        medication: 'bg-primary',
        special: 'bg-dark',
        emergency_followup: 'bg-danger',
        grief_process: 'bg-purple',
        hospital_discharge: 'bg-success',
        temporary_suspension: 'bg-info',
        return_home: 'bg-secondary',
        heat_wave: 'bg-warning',
        vaccinations: 'bg-teal'
      };
      return classes[alert.type] || 'bg-secondary';
    },
    async firstRelatedCall() {
      const response = await this.callRepository.getCallByAlertId(this.selectedAlert.id);


      if (response.data === undefined || response.data.length === 0) {
        // console.log('No hay llamadas relacionadas' + response.data);
        return
      }
      // console.log(response.data.length)
      this.idRelatedCall = response.data[0].callId;
    },
    processRecurringAlerts(alerts) {
      return alerts.flatMap(alert => {
        if (!alert.isRecurring || !alert.endDate || !alert.dayOfWeek) {
          return alert;
        }

        const startDate = new Date(alert.date);
        const endDate = new Date(alert.endDate);
        const dayNameToNumber = {
          'Sunday': 0,
          'Monday': 1,
          'Tuesday': 2,
          'Wednesday': 3,
          'Thursday': 4,
          'Friday': 5,
          'Saturday': 6
        };
        const daysOfWeek = alert.dayOfWeek ? alert.dayOfWeek.split(', ').map(day => dayNameToNumber[day]) : [];

        // console.log('Processing recurring alert:', alert);
        // console.log('Start Date:', startDate);
        // console.log('End Date:', endDate);
        // console.log('Days of Week:', daysOfWeek);
        // console.log('Raw days of Week' + alert.dayOfWeek);

        const recurringAlerts = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          // console.log('Checking date:', date);
          if (daysOfWeek.length === 0 || daysOfWeek.includes(date.getDay())) {
            // console.log('Adding recurring alert for date:', date);
            recurringAlerts.push({
              ...alert,
              date: date.toISOString().split('T')[0]
            });
          }
        }

        return recurringAlerts;
      });
    },
    selectToday() {
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      const dayElement = document.querySelector(`.id-${formattedToday} .vc-day-content`);
      if (dayElement) {
        dayElement.click();
      }
    }
  },
  async mounted() {
    if (this.alerts.length === 0) {
      await this.loadAlerts();
      await this.loadCalls();
    }
    this.allAlerts = this.alerts;
    // console.log(this.allAlerts);

    this.allAlerts = this.processRecurringAlerts(this.alerts);
    this.isLoading = false;

    for (const alert of this.allAlerts) {
      const callId = this.getCallByAlertId(alert.id);
      console.log(`Alert ID: ${alert.id}, Call ID: ${callId}`);
    }
    this.selectToday();
  },


};
</script>

<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 5rem;
}

.card {
  border: none;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
}

.card-title {
  color: #344767;
  font-weight: 600;
}

.input-group-text {
  border-radius: 10px 0 0 10px !important;
  border: 1px solid #ced4da;
}

.input-group .form-control {
  border-radius: 0 10px 10px 0 !important;
  border: 1px solid #ced4da;
  font-size: 1rem;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #80bdff;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  color: #344767;
  border-bottom-width: 1px;
  padding: 1rem;
}

.table td {
  padding: 1rem;
  vertical-align: middle;
}

.alert-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.alert-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

.btn-action {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  background-color: #f8f9fa;
  color: #495057;
  border: 1px solid #ced4da;
}

.gap-3 {
  gap: 1rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.pagination {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 0.5rem;
}

.pagination-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4b5563;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-button:hover {
  background-color: #f3f4f6;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.is-current {
  background-color: #3b82f6;
  color: #ffffff;
}

.pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0 0.25rem;
  font-weight: 500;
  color: #4b5563;
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
    padding-bottom: 5rem;
  }

  .card-header {
    padding: 1rem;
  }

  .table td,
  .table th {
    padding: 0.75rem;
  }

  .btn-action {
    margin-bottom: 30px;
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
}

.add-alert-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background: #fff;
  border: 1px solid #dee2e6;
}

.add-alert-btn:hover {
  background: #007bff;
  color: white;
  border-color: #007bff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}
</style>