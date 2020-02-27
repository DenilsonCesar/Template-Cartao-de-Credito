import React, { Component } from 'react';

import { 
  View, Text, 
  SafeAreaView, StyleSheet, 
  TextInput, ScrollView, 
  Keyboard, Modal, TouchableOpacity,
  ActivityIndicator 
} from 'react-native';

// import { Container } from './styles';
import { TextInputMask } from 'react-native-masked-text';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Lottie from 'lottie-react-native';
import api from '../services/api'

import plusimed from '../lotties/sucesso.json';
import plusimed2 from '../lotties/alerta.json';
import plusimed3 from '../lotties/loading.json';

export default class pages extends Component {
  constructor(props){
    super(props);
    this.state = {
      nome: '',
      numero: '',
      validade: '',
      cvv: '',
      cardcvv: false,
      modalCampoIncorreto: false,
      modalCampoSucesso: false,
      loading: false,
    }
  }

  onFocus() {
    this.setState({ cardcvv: true })
  }

  onBlur() {
    this.setState({ cardcvv: false })
  }

  pagarmento = async () => {
    try {
      Keyboard.dismiss();
      this.setState({ loading: true })
      const { nome, numero, validade, cvv } = this.state;
      const response = await api.post('post', {
        card_number: numero,
        card_cvv: cvv,
        card_expiration_date: validade,
        card_holder_name: nome,
        email: "mopheus@nabucodonozor.com",
        cpf: "61799590305", 
        phone_numbers: "+5511999998888", 
        birthday: "1965-01-01"
      })
      this.setState({ loading: false })
      this.setState({ modalCampoSucesso: true })
    } catch (error) {
      this.setState({ loading: false })
      Keyboard.dismiss();
      this.setState({ modalCampoIncorreto: true })
    }
  }
  
  render() {
    if(this.state.loading == true){
      return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Lottie style={{ height: 300, width: 300 }} autoSize resizeMode="contain" source={plusimed3} autoPlay loop/>
        </View>
      )
    }else{
      return (
        <SafeAreaView style={styles.container}>
        {this.state.cardcvv ? 
          <Animatable.View style={styles.cardCenter}>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.plus}>Plus</Text>
              <Text style={styles.imed}>imed</Text>
            </View>

            <LinearGradient colors={['#2980b9', '#2ecc71']} style={styles.cardAvesso}>
              <View style={styles.lista}></View>
              <View style={styles.cardcvvend}>
                <TextInput 
                  value={this.state.cvv}
                  placeholder="CVV"
                  maxLength={3}
                  style={styles.inputcvv}
                />
              </View>
            </LinearGradient>
          </Animatable.View>
          
          :

          <Animatable.View style={styles.cardCenter}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.plus}>Plus</Text>
              <Text style={styles.imed}>imed</Text>
            </View>
      
            <LinearGradient colors={['#2980b9', '#2ecc71']} style={styles.card}>
              <TextInputMask
                editable={false}
                placeholderTextColor='#fff'
                placeholder="**** **** **** **** ****" 
                style={styles.cardNumero}
                type={'credit-card'}
                options={{
                  obfuscated: false,
                  mask: '**** **** **** ****'
                }}
                value={this.state.numero}
                onChangeText={text => {
                  this.setState({
                    numero: text
                  })
                }}
              />
              <View 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  marginRight: 20,
                  marginLeft: 20 
                }}>
                <TextInput 
                  autoCorrect={false}
                  maxLength={20}
                  value={this.state.nome.toUpperCase()}
                  editable={false} 
                  style={styles.cardNome} 
                  placeholder="NOME IMPRESSO CARTÃO"
                  placeholderTextColor='#fff'/>
                <TextInputMask
                  editable={false} 
                  style={styles.cardValidade} 
                  placeholder="MM/YY"
                  placeholderTextColor='#fff'
                  type={'datetime'}
                  options={{
                    format: 'MM/DD'
                  }}
                  value={this.state.validade}
                />
              </View>
            </LinearGradient>
          </Animatable.View>}
          <ScrollView style={{ marginTop: 20 }} horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <Text style={styles.inputTitulo}>NÚMERO DO CARTÃO</Text>
              <TextInput
                maxLength={16}
                value={this.state.numero}
                onChangeText={text => this.setState({numero: text})}
                returnKeyType = { "next" } 
                onSubmitEditing={() => { this.segundoTextInput.focus(); }}
                blurOnSubmit={false}
                keyboardType={'numeric'} 
                placeholder="Número do Cartão" 
                style={styles.inputNumber}/>
            </View>

            <View>
              <Text style={styles.inputTitulo}>NOME IMPRESSO NO CARTÃO</Text>
              <TextInput 
                value={this.state.nome}
                onChangeText={text => this.setState({nome: text})}
                ref={(input) => { this.segundoTextInput = input; }}
                returnKeyType = { "next" } 
                onSubmitEditing={() => { this.terceiroTextInput.focus(); }}
                blurOnSubmit={false}
                placeholder="Nome Impresso no Cartão" 
                style={styles.inputNumber}/>
            </View>

            <View>
              <Text style={styles.inputTitulo}>VALIDADE</Text>
              <TextInput
                maxLength={4} 
                value={this.state.validade}
                onChangeText={text => this.setState({validade: text})}
                ref={(input) => { this.terceiroTextInput = input; }}
                returnKeyType = { "next" } 
                onSubmitEditing={() => { this.quartoTextInput.focus(); }}
                blurOnSubmit={false}
                keyboardType={'numeric'} 
                placeholder="Validade" 
                style={styles.inputValidade}/>
            </View>

            <View>
              <Text style={styles.inputTitulo}>CVV</Text>
              <TextInput 
                onFocus={ () => this.onFocus() }
                onBlur={ () => this.onBlur() }
                value={this.state.cvv}
                onChangeText={text => this.setState({cvv: text})}
                maxLength={3}
                ref={(input) => { this.quartoTextInput = input; }}
                onSubmitEditing={() => { this.pagarmento() }}
                returnKeyType = { "send" } 
                blurOnSubmit={false}
                keyboardType={'numeric'} 
                placeholder="CVV" 
                style={styles.inputCvv}/>
            </View>
          </ScrollView>
          
          {/* Modal de cadastro incorreto */}
          {!this.state.modalCampoIncorreto ? <View/> : 
            <Modal 
              transparent
              isVisible={this.state.modalCampoIncorreto}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: '#fff', elevation: 5, borderRadius: 10, height: 370, width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.desc}>Cuidado!</Text>
                  <Text style={styles.desc2}>Houve um erro ao realizar pagamento!</Text>
                  <Text style={styles.desc3}>Tente novamente!</Text>
                  <Lottie style={{ height: 150, width: 150, alignSelf: 'center' }} autoSize resizeMode="contain" source={plusimed2} autoPlay loop/>
                  <View>
                    <TouchableOpacity style={[styles.botaoOk, styles.botaoTentarNovamente]} onPress={() => this.props.navigation.navigate('Perfil')}>
                      <Text style={styles.textoBotao}>TENTAR NOVAMENTE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          }

          {/* Modal de cadastro sucesso */}
          {!this.state.modalCampoSucesso ? <View/> : 
            <Modal 
              transparent
              isVisible={this.state.modalCampoSucesso}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ backgroundColor: '#fff', elevation: 5, borderRadius: 10, height: 350, width: '80%', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.desc}>Sucesso!</Text>
                  <Text style={styles.desc3}>Pagamento efetuado.</Text>
                  <Text style={styles.desc2}>Aguarde a análise ser concluida!</Text>
                  <Lottie style={{ height: 150, width: 150 }} autoSize resizeMode="contain" source={plusimed} autoPlay loop/>
                  
                  <View>
                    <TouchableOpacity style={[styles.botaoOk, styles.botaoContinuar]} onPress={() => this.props.navigation.navigate('Perfil', { responseApi: true })}>
                      <Text style={styles.textoBotao}>CONTINUAR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          }
          
        </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  cardCenter: {
    alignItems: 'center'
  },
  card: {
    width: '85%',
    height: 200,
    borderRadius: 8,
    //backgroundColor: '#3333'
  },
  cardAvesso: {
    width: '85%',
    height: 200,
    borderRadius: 8,
  },
  plus: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'blue'
  },
  imed: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'green'
  },
  inputNumber: {
    width: 290,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginLeft: 20,
    fontSize: 20
  },
  inputValidade: {
    width: 90,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginLeft: 20,
    fontSize: 20
  },
  inputCvv: {
    width: 80,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginLeft: 20,
    marginRight: 25,
    fontSize: 20
  },
  inputTitulo: {
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 20,
    color: "#000"
  },
  cardNome: {
    fontSize: 18,
    color: "#fff"
  },
  cardNumero: {
    marginTop: 90,
    marginRight: 50,
    marginLeft: 20,
    fontSize: 25,
    color: "#fff"
  },
  cardValidade: {
    fontSize: 18,
    color: "#fff"
  },
  cardCvv: {
    fontSize: 18,
    color: "#fff"
  },
  lista: {
    backgroundColor: '#000',
    height: 45,
    width: '100%',
    marginTop: 30
  },
  inputcvv: {
    backgroundColor: '#fff',
    height: 46,
    width: 70,
    fontSize: 22,
    paddingLeft: 10,
  },
  cardcvvend: {
    alignItems: 'flex-end',
    paddingRight: 20,
    paddingTop: 10
  },
  botaoOk: {
    width: 250,
    height: 45,
    borderRadius: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    elevation: 5,
    marginTop: 10
  },
  botaoContinuar: {
    backgroundColor: '#4B79E5',
  },
  botaoTentarNovamente: {
    backgroundColor: '#FF0000',
  },
  textoBotao: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Roboto-Regular'
  },
  desc: {
      fontSize: 22,
      color: '#000',
      marginBottom: 15,
      fontFamily: 'Roboto-Regular',
      fontWeight: 'bold'
  },
  desc2: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    color: '#4B79E5'
  },
  desc3: {
    fontSize: 18,
    color: '#333',
    //marginBottom: 10,
    fontFamily: 'Roboto-Regular',
    fontWeight: 'bold'
  }

})
