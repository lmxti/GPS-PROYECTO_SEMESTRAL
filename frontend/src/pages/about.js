import React from 'react'
import NavBar from "@/components/nav/NavBar";
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import { FaReact } from "react-icons/fa";
import { RiNextjsFill } from "react-icons/ri";
import { SiMongodb } from "react-icons/si";
import { SiExpress } from "react-icons/si";

export default function about() {
  return (
    <div>
        <NavBar/>
        <div className="flex flex-col min-h-[100dvh] container mx-auto mt-4">
            <header className="bg-fixed rounded-3xl p-8 bg-[url('/wallpapers/wallpaper-about2.png')] bg-cover bg-bottom">
                <section className="container">
                    <div className="flex flex-col items-center text-center space-y-4 p-8">
                        <div className="flex items-center flex-row md:flex-col">
                            <Avatar alt="Logo" src="/icons/ovni1.png" sx={{ width: 100, height: 100 }}  />
                            <div>
                                <h1 className="text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-zinc-100">Foro estudiantil</h1>
                                <p className="text-lg text-zinc-200">Proyecto Gestión de Proyectos de Software</p>
                            </div>
                        </div>

                        <p className="max-w-[600px] text-zinc-200">
                            El principal objetivo de este proyecto es solucionar el problema del entorno educativo actual, proporcionando
                            un espacio para fomentar/potenciar tanto como la comunicación y la colaboración efectiva entre la comunidad de estudiantes.
                        </p>
                    </div>
                </section>
                <Divider color='white'/>
                <section className="flex flex-col items-center justify-center space-y-8 text-center p-8">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-zinc-100">Tecnologías</h2>
                    <p className="max-w-[700px] text-lg text-zinc-200">
                    Este proyecto esta basado y desarrollado en el stack de tecnologias <span className='font-bold'>M-E-R-N </span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full uppercase">
                        <div className="flex flex-col items-center space-y-2 bg-zinc-600/10 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900 py-4 rounded-lg">
                            <SiMongodb size={100} />
                            <p>MongoDB</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 bg-zinc-600/10 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900 py-4 rounded-lg">
                            <SiExpress size={100}/>
                            <p>Express.js</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 bg-zinc-600/10 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900 py-4 rounded-lg">
                            <FaReact size={100} />
                            <p>React</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 bg-zinc-600/10 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900 py-4 rounded-lg">
                            <RiNextjsFill size={100}/>
                            <p>Next.js</p>
                        </div>
                    </div>
                </section>
                <Divider color='white'/>
                <section className="w-full rounded-3xl p-8">
                    <div className="container px-4 md:px-6 ">
                        <div className="flex flex-col items-center justify-center space-y-8 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-zinc-100">Nuestro Equipo</h2>
                                <p className="max-w-[650px] text-zinc-200">
                                Conoce los desarrolladores que dieron vida a este proyecto proporcionando todo lo que ves actualmente.
                                </p>
                            </div>
                            <div className="w-10/12 grid grid-cols-1 sm:grid-cols-2 gap-6 container ">
                                <div className="flex flex-col items-center py-4 rounded text-zinc-200 bg-zinc-600/10 hover:bg-zinc-600/30">
                                    <Avatar sx={{ width: 80, height: 80, marginY:2 }}/>
                                    <div className="space-y-1 text-center ">
                                        <h3 className="text-lg font-semibold">Matías S. Martín</h3>
                                        <p>Lider de proyecto - Programador - Diseñador</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center py-4 rounded text-zinc-200 bg-zinc-600/10 hover:bg-zinc-600/30">
                                    <Avatar sx={{ width: 80, height: 80, marginY:2 }}/>
                                    <div className="space-y-1 text-center ">
                                        <h3 className="text-lg font-semibold">Domingo Vega</h3>
                                        <p>Programador</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </header>
        <main className="flex-1">

        </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Proyecto de GPS - FORO.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Términos de Servicio
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
    </div>
  )
}

