const latitudeValidator = (latitude,isDegree) => {
    if(isDegree) {
        if(latitude > 90 || latitude < -90) {
            return false;
        }
        else {
            return true;
        }
    }
    else{
        if(latitude > Math.PI / 2 || latitude < -1 * Math.PI / 2) {
            return false;
        }
        else {
            return true;
        }
    }
}