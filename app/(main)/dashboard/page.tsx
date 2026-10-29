import { checkUser } from '@/actions/check-user';
import { redirect } from 'next/navigation';
import React from 'react'

const DashboardPage = async () => {
    const user = await checkUser();
    if(!user) {
        redirect("/sign-in");
    }
  return (
    <div>
      Dashboard Page
    </div>
  )
}

export default DashboardPage

