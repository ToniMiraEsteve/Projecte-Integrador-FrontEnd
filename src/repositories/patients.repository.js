import { useAuthStore } from "@/stores/auth.js";

const server = import.meta.env.VITE_URL_API;

export default class PatientsRepository {
  async getAllPatients(filter = "") {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients" + filter, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    return await response.json();
  }

  async getPatientById(idPatient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients/" + idPatient, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return await response.json();
  }

  async addPatient(patient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(patient)
    });

    return await response.json();
  }

  async removePatient(idPatient) {
    const authStore = useAuthStore();
    const token = authStore.token;

    const response = await fetch(server + "/patients/" + idPatient, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });


    return await response.json();
  }

  async changePatient(id, patient) {
    const authStore = useAuthStore();
    const token = authStore.token;
  
    // Crear un objeto con solo los campos necesarios
    console.log(patient.languages);
    const patientData = {
      fullName: patient.fullName,
      birthDate: patient.birthDate,
      fullAddress: patient.fullAddress,
      dni: patient.dni,
      healthCardNumber: patient.healthCardNumber,
      phone: patient.phone,
      email: patient.email,
      zoneId: patient.zoneId,
      personalFamilySituation: patient.personalFamilySituation,
      healthSituation: patient.healthSituation,
      housingSituation: patient.housingSituation,
      personalAutonomy: patient.personalAutonomy,
      economicSituation: patient.economicSituation,
      operatorId: patient.operatorId,
      languages: patient.languages,
      status: patient.status
    };
  
    const response = await fetch(server + "/patients/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(patientData)
    });
  

    return await response.json();
  }
}
