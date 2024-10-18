export const isTokenValid = (expireTime, token) => {
    const expireTimeInMilliseconds = new Date(expireTime).getTime();
    const currentTimeInMilliseconds = new Date().getTime();
    if(currentTimeInMilliseconds < expireTimeInMilliseconds && token){
        return true;
    }else{
        return false
    }
}