import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useLogin from '../../hooks/useLogin'

const Login = () => {

  const [username,setUserName] = useState("")
  const [password,setPassword] = useState("")

  const {loading, login} = useLogin()


  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username,password)
  }


  return (
      <div className='mx-auto w-auto md:w-1/2 bg-neutral text-neutral-content p-6 round-lg shadow-md'>
        <h1 className='text-3xl font-semibold text-center pb-2'>
            Login
        </h1>
        <form on onSubmit={(handleSubmit)}>
            <div className='p-1'>
                <label className="input input-bordered bg-base-100 text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                <input type="text" className="grow" placeholder="Username" 
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
                </label>
            </div>
            <div className='p-1'> 
                <label className="input input-bordered bg-base-100 text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                <input type="password" className="grow" placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </label>
            </div>
            <div>
                <Link to="/signup" className='text-sm hover:underline hover:text-black mt-2 inline-block'> Don't have an account?</Link>
            </div>
            <div>
                <button className='btn btn-primary btn-block mt-2' disabled={loading}>
                  {loading ? <span className='loading loading-spinner'></span> : "Login"}
                </button>
            </div>
        </form>
      </div>
  )
}

export default Login
