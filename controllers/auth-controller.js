import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log('Successfully created new user:', userCredential.user.uid);
    res.status(200).json({ message: 'User registration successful' });
  })
  .catch((error) => {
    console.log('Error creating new user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    console.log('Successfully authenticated user:', userCredential.user.uid);
    res.status(200).json({ message: 'User login successful', tokenId: userCredential.user.accessToken });
  })
  .catch((error) => {
    console.log('Error authenticating user:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  });
};

export default { registerUser, loginUser };