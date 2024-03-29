"use client"
import Chatbot from "./Chatbot"
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Menu, Popover, Transition  } from "@headlessui/react";
import Album from "./Album";
import "./navbar.css"
import Image from 'next/image'

const { createClient } = require('@supabase/supabase-js');
// Replace these with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPA_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPA_KEY;
// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);


export default function Landing() {
  const [rows, setRows] = useState([""]);
  const [totalSummary, setTotalSummary] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const { data, error } = await supabase
                .from('memories')
                .select();

            if (error) {
                console.error(error);
                return;
            }

            if (data) {
                setRows(data);
                setLoading(false);
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    fetchData();
}, []);



  return (
      // <div>Hello from landing!</div>
      <>
      <div className="min-h-full bg-gray-50">
      <Popover as="header" className="pb-24">
          {({ open }) => (
            <>
              <div className='nav-bar'>
                <div className="flex justify-center">   
                <div className='nav-bar'>
                  <div className="brain-nav">
                    <Image src="/brain.png" width={100} height={100} className="brain-img"/>
                  </div>
                  <div className='nav-text'>
                    <h1 className='text-4xl'>DementiaBuddy</h1>
                  </div>
                </div>  
                  {/* Right section on desktop */}
                  <div className="icon">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-white text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img className="h-12 w-12 rounded-full" src="/icon.jpg" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                        >
                        <Menu.Items className="absolute right-[-13px] z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-center">
                          <div className="py-1">
                            <form method="POST" action="#">
                              <Menu.Item>
                                {({ active }) => (
                                    <button
                                    type="submit"
                                    className="text-[#132143]">
                                    <Link href="/">Sign out</Link>
                                  </button>
                                )}
                              </Menu.Item>
                            </form>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="hidden  py-5 lg:block">
                  <div className="grid grid-cols-3 items-center gap-8">
                    <div className="col-span-2">
                      <nav className="flex space-x-4"></nav>
                    </div>
                    <div>
                      <div className="mx-auto w-full max-w-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Popover>
        <main className="-mt-24 pb-8 bg-[#FFB6C1] pt-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2 overflow-hidden rounded-lg bg-white shadow p-6 h-full no-scrollbar">
                  <section aria-labelledby="section-1-title">
                    {/** ALBUM BEGINS HERE, CAESAR */}
                    { !loading &&
                      <Album data={rows}/>
                    }
                  </section>
              </div>

            {/* Right column */}
            <div className="grid grid-cols-1 gap-4lg:col-span-2 overflow-hidden rounded-lg bg-white shadow p-6 h-[75vh] no-scrollbar">
                <section aria-labelledby="section-2-title">
                  {/** Chatbot BEGINS HERE, MARSHAL */}
                  { !loading &&
                      <Chatbot data={rows}/>
                    }
                </section>
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

