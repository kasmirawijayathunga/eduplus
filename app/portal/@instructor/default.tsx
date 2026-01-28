'use client'

import Error from 'next/error'

function Default() {
  return <Error statusCode={404} title="Not Found" />
}

export default Default