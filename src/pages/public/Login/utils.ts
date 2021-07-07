

export const isEmailValid = (email: string) => {
    if(process.env.NODE_ENV === 'development') return true

    return new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email)
}

export const isPasswordValid = (password: string) => {
    //if(process.env.NODE_ENV === 'development') return true

    const regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
    return regularExpression.test(password)
}

export interface IPasswordStrongResult {
    valid: boolean
    strong: number
    name: string
    variant: string
}
export const passwordStrong = (password: string):IPasswordStrongResult => {
    const length = password.length

    if(length < 1){
        return {
           valid: false,
           strong: 0,
           name: '',
           variant: 'danger'  
        } as IPasswordStrongResult
    }

    if(length >= 15){
        return {
            valid: true,
            strong: 100,
            name: 'strong',
            variant: 'success' 
         } as IPasswordStrongResult
    }

    const capital = /(?=.*[A-Z]){2,}/.test(password) ? 2 : ( /(?=.*[A-Z])/.test(password) ? 1 : 0)
    const lower = /(?=.*[a-z]){2,}/.test(password) ? 2 : ( /(?=.*[a-z])/.test(password) ? 1 : 0)
    const number = /(?=.*[0-9]){2,}/.test(password) ? 2 : ( /(?=.*[0-9])/.test(password) ? 1 : 0)
    const special = /(?=.*[!@#$%^&*]){2,}/.test(password) ? 2 : ( /(?=.*[!@#$%^&*])/.test(password) ? 1 : 0)
    
    const value = capital + lower + number + special

    const valid = (length > 7 && lower > 0 && number > 0) || process.env.NODE_ENV === 'development'
    let percentage = (value+(length/4))
    if(percentage > 10) percentage = 10

    return {
        valid,
        strong: percentage * 10,
        name: value > 6 ? 'strong' : (value > 4 ? 'intermediate' : (valid ? 'weak' : 'poor')),
        variant: percentage > 6 ? 'success' : (valid ? 'warning' : 'danger'),
    } as IPasswordStrongResult
    
}