//* validators/index.js
import register  from './register.validator'
import login  from './token.validator'
import post  from './post.validator'
import kyc from './kyc.validator'
import stakingSchema from './staking.validator'
import settingSchema from './setting.validator'
import profileSchema from './profile.validator'
import profitLossSchema from './profitloss.validator'

export = {
    register,
    login,
    post,
    kyc,
    stakingSchema,
    settingSchema,
    profileSchema,
    profitLossSchema
}