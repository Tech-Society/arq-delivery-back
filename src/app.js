import express from 'express'

// initialization
const app = express()

//routes
app.use('/', AuthRouter)
app.use('/client', ClientRoute)
app.use('/role', RoleRoute)
app.use('/privilege', PrivilegeRoute)
app.use('/role-privilege', verifyToken, RolePrivilegeRoute)
app.use('/user', UserRouter)

export default app