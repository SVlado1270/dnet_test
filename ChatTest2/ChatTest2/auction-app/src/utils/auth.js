function isLoggedIn() {
    const expireDate = localStorage.getItem("expireDate");
    return Date.parse(expireDate) > new Date().getTime()
}

export default isLoggedIn;