import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className='py-16'>
      <div className="mx-auto max-w-3xl px-6">
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="p-8 text-center">
            <img src="/notfound.png" alt="notfound" style={{ maxWidth: '320px', width: '100%', margin: '0 auto 16px' }} />
            <h3 className='text-xl font-semibold mb-2'>Page not found</h3>
            <p className='mb-4 text-slate-600'>The page you are looking for does not exist or has been moved.</p>
            <Link to={'/'} className='inline-flex items-center justify-center px-4 py-2 rounded-md border border-sky-600 text-sky-700 bg-white hover:bg-sky-50'>Return to Home</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound
