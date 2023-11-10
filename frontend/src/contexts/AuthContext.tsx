import { createContext, ReactNode, useState, useEffect } from "react";

import { api } from "../services/apiClient";

import { destroyCookie, setCookie, parseCookies} from 'nookies'
import Router from 'next/router';

import { toast} from 'react-toastify'

type AuthContextData = {
    user: UserProps | undefined; // Use `undefined` as the initial value
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>; // Corrigido o tipo da função
    signOut: () => void;
    signUp: (credentials: signUpProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type signUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData); // Corrigido o nome do contexto

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')

    }catch{
        console.log('erro ao deslogar')

    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | undefined>(undefined); // Corrigido o tipo e o valor inicial
    const isAuthenticated = !!user;

    useEffect(() => {

        //tentar pegar algo no cookie
        const { '@nextauth.token': token} = parseCookies();

        if(token){
            api.get('/me').then(response => {
                const {id,name, email} = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                //se deu erro deslogamos o usuario
                signOut();
            })
        }
        
    }, [])

    async function signIn({ email, password }: SignInProps): Promise<void> {
        // Aqui você pode adicionar a lógica de autenticação e retornar a Promise correspondente
        // Por exemplo:
        // Simulando uma autenticação assíncrona bem-sucedida após 1 segundo
        try{
            const response = await api.post('/session', {
                email,
                password
            })

            //console.log(response.data);

            const {id, name, token} = response.data

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //expirar em 1 mes
                path: "/" // quais caminhos terao acesso ao cookie
            })
            

            setUser({
                id,
                name,
                email,
            })

            //passar para proximas requisicoes o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')

            //Redirecionar o user para /dashboard
            Router.push('/dashboard')

        }catch(err){
            toast.error("Erro ao Acessar!")
            console.log("ERRO AO ACESSAR", err)

        }
        return new Promise((resolve) => {
            setTimeout(() => {
                // Define o usuário após a autenticação bem-sucedida
                setUser({
                    id: "1",
                    name: "Exemplo",
                    email: email,
                });
                resolve();
            }, 1000);
        });
    }

    async function signUp({name, email, password}: signUpProps){
        try{

            const response = await api.post('/users', {
                name,
                email,
                password
            })
                toast.success("Conta criada com sucesso!")

                Router.push('/')


        }catch(err){
            toast.error("Erro ao cadastrar!")
            console.log("erro ao cadastrar", err)

        }

    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
}
