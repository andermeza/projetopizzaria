import React, {useState} from 'react';
import {
    View,
     Text,
     StyleSheet,
     Image,
     TextInput,
     TouchableOpacity
    } from 'react-native'

export default function SignIn(){
    const [email , setEmail ] = useState('');
    const [password, setPassord] = useState('');

    function handleLogin(){

        if(email === '' || password === ''){
            return;
        }
       console.log('email digitado ' + email)
    }

    return (
        <View style={styles.container}>
            
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Digite seu email"
                    style={styles.input}
                    placeholderTextColor='#f0f0f0'
                    value={email}
                    onChangeText={setEmail}

                    />
                    <TextInput
                    placeholder="Sua Senha"
                    style={styles.input}
                    placeholderTextColor='#f0f0f0'
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassord}

                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}> Acessar</Text>

                    </TouchableOpacity>


            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1d1d2e'
    },
    inputContainer:{
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    input:{
        width: '95%',
        height: 40,
        backgroundColor: '#101026',
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8, 
        color: '#fff'
    },
    button:{
        width: '95%',
        height: 40,
        backgroundColor: '#3fffa3',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#101026'
    }
})