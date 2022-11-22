import '../styles/globals.css'
import { Provider } from 'react-redux'
import { store } from '../global/store'
import auth from '../firebase/initFirebase'
import { onAuthStateChanged } from 'firebase/auth';

function MyApp({ Component, pageProps }) {

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log('user data: ', user)
      // ...
    } else {
      // User is signed out
      // ...
      console.log('user is signed out')
    }
  });



  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
