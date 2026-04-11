import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { AuthServices } from "../services/auth.service";

export default function Verify() {
  const { token } = useParams();
console.log(token);

const navigate = useNavigate()

  useEffect(() => {
    const getVerification = async () => {
      const res = await AuthServices.verifyEmail(token)
      console.log('verify page', res.data);
      navigate('/')      
    }
    getVerification()
  }, []);

  return <h2>Verifying...</h2>;
  
}
