import { useDebugValue } from "react";

export const patients_columns = [
    {
        id: 'id_num',
        label: 'Num. Identificacion',
        minWidth: 100,
        format: (value) => value
    },
    {
        id: 'name',
        label: 'Nombres',
        minWidth: 200,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'last_name',
        label: 'Apellidos',
        minWidth: 200,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'gender',
        label: 'Sexo',
        minWidth: 150,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'type',
        label: 'Tipo de paciente',
        minWidth: 150,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'options',
        label: '',
        minWidth: 50,
        align: 'left',
    }
];

export const medical_consultation_columns_with_participant = [
    {
        id: 'names',
        second_id : "yes",
        label: 'Paciente',
        minWidth: 100,
        align: 'left',
        value: (value) => value
    },
    {
        id: 'date',
        label: 'Fecha y hora',
        minWidth: 100,
        align: 'left',
        format: (value) => new Date(value).toLocaleString(),
    },
    {
        id: 'solicited_service',
        label: 'Servicio solicitado',
        minWidth: 200,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'options',
        label: '',
        minWidth: 150,
        align: 'left'
    }
];

export const medical_consultation_columns = [
    {
        id: 'date',
        label: 'Fecha',
        minWidth: 100,
        align: 'left',
        format: (value) => new Date(value).toLocaleString(),
    },
    {
        id: 'solicited_service',
        label: 'Servicio solicitado',
        minWidth: 200,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'current_procedure',
        label: 'Procedimiento actual',
        minWidth: 400,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'options',
        label: '',
        minWidth: 150,
        align: 'left'
    }
];

export const medical_record_columns_with_patient = [
    {
        id: 'names',
        second_id: 'name',
        label: 'Paciente',
        minWidth: 80,
        align: 'left',
        value: (value) => value['id']
    },
    {
        id: 'heart_rate',
        label: 'FC',
        minWidth: 50,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'breathing_frequency',
        label: 'FR',
        minWidth: 50,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'temperature',
        label: 'T°',
        minWidth: 50,
        align: 'left',
        format: (value) => value + '°',
    },
    {
        id: 'blood_pressure_sis',
        label: 'SIS',
        minWidth: 50,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'blood_pressure_dia',
        label: 'DIA',
        minWidth: 50,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'weight',
        label: 'Pkg',
        minWidth: 50,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'size',
        label: 'Tcm',
        minWidth: 50,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'oxygen_saturation',
        label: 'SO2',
        minWidth: 50,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'options',
        label: '',
        minWidth: 100,
        align: 'left'
    }
];

export const medical_record_columns = [
    {
        id: 'heart_rate',
        label: 'FC',
        minWidth: 80,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'breathing_frequency',
        label: 'FR',
        minWidth: 80,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'temperature',
        label: 'T°',
        minWidth: 80,
        align: 'left',
        format: (value) => value + '°',
    },
    {
        id: 'blood_pressure_sis',
        label: 'SIS',
        minWidth: 80,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'blood_pressure_dia',
        label: 'DIA',
        minWidth: 80,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'weight',
        label: 'Pkg',
        minWidth: 80,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'size',
        label: 'Tcm',
        minWidth: 80,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'oxygen_saturation',
        label: 'SO2',
        minWidth: 80,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'options',
        label: '',
        minWidth: 100,
        align: 'left'
    }
];



export const supplys_columns = [
    {
        id: 'name',
        label: 'Nombre',
        minWidth: 200,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'amount',
        label: 'Cantidad',
        minWidth: 200,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'lote',
        label: 'Lote',
        minWidth: 150,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'supply_unit',
        label: 'Unidad',
        minWidth: 150,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'expiration_date',
        label: 'Fecha de caducidad',
        minWidth: 150,
        align: 'left',
        format: (value) => value,
    },
    {
        id: 'options',
        label: '',
        minWidth: 150,
        align: 'left'
    }
];
