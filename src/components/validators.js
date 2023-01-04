export const string_validator = (val) => {
    val = val.trim();
    if(val === '') return false;
    return true;
}

export const num_validator = (val) => {
    if(val.length === 0 || val === "" || val === '') return false;
    return /^-?\d+$/.test(val);
}

export const float_validator = (val) => {
    if(val.length === 0 || val === "" || val === '') return false;
    return /^[+-]?\d+(\.\d+)?$/.test(val);
}

export const validate = (values, validation_map) => {
    for(const key of Object.keys(values)){
        if(validation_map[key] === 'int'){
            if(num_validator(values[key]) === false){
                return false;
            }
        }else if(validation_map[key] === 'str'){
            if(string_validator(values[key]) === false){
                return false;
            }
        }
    }
    return true;
}

export const patient_map = {
    'name' : 'str',
    'last_name': 'str',
    'id_num': 'int',
    'age': 'int'
}

export const record_map = {
    'heart_rate' : 'float',
    'breathing_frequency': 'float',
    'temperature': 'float',
    'blood_pressure_sis': 'float',
    'blood_pressure_dia': 'float',
    'weight': 'float',
    'oxygen_saturation': 'float',
    'waist_hip_index': 'float',
    'body_mass_index': 'float',
    'glucose': 'float',
    'size': 'float',
}

export const consultation_map = {
    'solicited_service' : 'str',
    'current_procedure': 'str',
    'physical_exploration': 'str',
    'medical_diagnosis': 'str',
}

