import React, {useEffect, useState} from 'react'
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, Spinner, Button, Dialog, Card, CardBody, CardFooter, Typography, Input } from '@material-tailwind/react'
import { useNavigate, Link } from 'react-router-dom'
import { makeApiCall, makeApiCallWithAuth, makeApiGetCallWithAuth } from '../Services/Api' 
import wrongSign from '../Assets/wrongSign.svg'
import { motion } from "framer-motion";
import Canara from '../Assets/Canara.svg'
import  RedeemAccordion  from './RedeemAccordion'
import { CopyButton } from './copyButton';
import { XMarkIcon } from "@heroicons/react/24/outline";  

const redeemSteps = [
    "Go to the official website and log in.",
    "Navigate to the 'Redeem Coupon' section.",
    "Enter your coupon code and click apply.",
    "Enjoy the benefits of your redeemed coupon!"
];

const terms = [
    "Coupon is valid for one-time use only.",
    "Cannot be combined with other offers.",
    "Expiry date applies as per mentioned on the coupon.",
    "The company reserves the right to change terms without notice."
];


function CouponForm (){
    const [coupon, setCoupon] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [modal, setModal] = useState('')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [apiRes, setApiRes] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [terms, setTerms] = useState([])
    const [redeem, setRedeem] = useState([])

    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const sessionId = queryParams.get('sessionid');
    const virtualId = queryParams.get('virtualid');
    const bankName = queryParams.get('bankName');

    if (token) {
        sessionStorage.setItem('token', token)
    }

    useEffect(() => {
        if(!sessionStorage.getItem('refferer')){
        sessionStorage.setItem('refferer', document.referrer)
        }
    },[]);

    useEffect(() => {
        console.log(token)
        if (token || sessionId) {
        const data = {
            applicationId: "pwa1",
            token: token ? token : '',
            virtualId: virtualId ? virtualId : '',
            SessionId: sessionId ? sessionId : '',
            bName: bankName ? bankName : '',
            deviceType: "WEB",
            GenerateSessionInfo: sessionId ? true : false,
        }
        makeApiCall('validateToken', data)
        .then((response) => {
            console.log("resp",response.data)
            if(sessionId){
            if(response.data?.data[0]?.token){
            sessionStorage.setItem('token', response.data.data[0].token)
            window.location.reload();
            
            }
            else if(!sessionStorage.getItem('token')){
            if(!modal){
                setModal('failed')
            }
            }
            }
            if(token){
            if(!response.data?.data[0]?.token){
                sessionStorage.setItem('token','')
                if(!modal){
                setModal('failed')
                }
                
            }
            }
        })
        .catch((e) => console.log("err", e))
        }
        else{
        if(!sessionStorage.getItem('token')){
            if(!modal){
            setModal('failed')
            }
        }
        }
    },[]);

    const handleSubmit = () => {
        setLoading(true)
        if (!coupon){
            setError('coupon code is required')
        }
        makeApiCallWithAuth('getCouponcode',{"claim_code":coupon})
        .then((response)=>{
            if(response?.data?.status === 200){
                setApiRes(response?.data?.data)
                setRedeem(
                    response?.data?.data?.redeemSteps
                        ?.split("</p><p>") 
                        .map(step => 
                            step
                            .trim() 
                            .replace(/<\/?p>/g, '')
                            .replace(/^\d+\.\s*/, '') 
                        )
                );
                setTerms(
                    response?.data?.data?.terms
                        ?.split("</p><p>") 
                        .map(term => 
                            term
                            .replace(/<\/?p>/g, '')
                            .replace(/^\d+\.\s*/, '') 
                        )
                );
                setShowPopup(true)
            }
            else if(response?.data?.status === 201){
                setApiRes(response?.data?.data)
                setShowPopup(true)
            }
            else if(response?.data?.status === 400){
                setMessage(response?.data?.message)
            }
            console.log(response)
        },
        setLoading(false)
    )
    }

    const handleCloseModal=() => {
        setModal('false')
        navigate('/exitpwa')
    }

return(
    <>
    <div className='w-screen overflow-y-auto min-h-screen md:px-10'>
        <div className='overflow-x-hidden max-w-[1200px]  m-auto'>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#3B2463] to-[#7D4DA1] p-4">
        {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-gray-500 bg-opacity-50 z-50"
        ></motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="relative shadow-2xl p-6 rounded-2xl bg-white">
          <CardBody className=" text-center flex flex-col items-center">
            <img src={Canara} className='absolute top-0 -translate-y-1/2 w-20 shadow-lg rounded-full'></img>
            <h2 className="text-2xl font-bold text-gray-800 mt-5">Enter Your Coupon Code</h2>
            <input
            type="text"
            placeholder="Enter code"
            value={coupon}
            onChange={(e) => {setMessage('');setError('');setCoupon(e.target.value)}}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7D4DA1] mt-5"
            />
            {error  &&  
            <p className='text-sm text-red-400 self-start px-2'>{error}</p>
            }
            <Button onClick={handleSubmit} className="capitalize w-full bg-[#F15A24] hover:bg-[#D94E1F] text-white p-3 rounded-lg mt-5">
                Claim your Rewards
            </Button>
            {message && <p className="text-sm text-red-400 pt-1 px-2">{message}</p>}
          </CardBody>
        </Card>
      </motion.div>
      {showPopup && (
        <>
        {/* Background Blur Effect */}
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-50 fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t rounded-t-2xl text-center"
        >
          <Button  
            onClick={(e)=>{setShowPopup(false)}}  
            onMouseDown={(event) => {
                event.stopPropagation();
                setShowPopup(false);
            }}
            className="absolute right-[50%] -top-12 translate-x-1/2 text-black bg-white shadow-lg rounded-full p-2 hover:bg-gray-200 transition-all"
            >  
            <XMarkIcon className="w-5 h-5 pointer-events-none" />  
          </Button> 
          {apiRes?.offerTitle ?
          <>
            <div className="text-center p-4">
            <h3 className="text-2xl font-semibold text-gray-900">{apiRes?.offerTitle}</h3>
            <p className="mt-2 text-base text-gray-700 leading-relaxed">{apiRes?.description}</p>
          </div>
          <div className="flex items-center justify-between p-2 py-1 border-2 border-dashed border-[#d94e1f] rounded-lg w-full bg-white shadow-sm">
            <span className="text-lg font-semibold text-gray-800">{apiRes?.couponCode}</span>
            <CopyButton textToCopy={apiRes?.couponCode} />
          </div>
          
          <div className='p-2'>
            <RedeemAccordion redeemSteps={redeem} terms={terms} />
          </div>
          <Button
            className="w-[90%] bg-[#F15A24] text-white text-[1.2rem] rounded-[10px] capitalize shadow-md hover:bg-[#d94e1f] transition-all py-2 mt-4"
            onClick={() => window.open(apiRes?.promoLink)}
            >
            Claim
          </Button>
          </>
          :
          <>
          <p className='my-4 text-lg text-gray-700 leading-relaxed'>You already purchased code!</p>
          <div className="flex items-center justify-between p-2 py-1 border-2 border-dashed border-[#d94e1f] rounded-lg w-full bg-white shadow-sm">
            <span className="text-lg font-semibold text-gray-800">{apiRes?.coupon_code}</span>
            <CopyButton textToCopy={apiRes?.coupon_code} />
          </div>
          </>
          
          }
          
        </motion.div>
        </>
      )}
    </div>
        </div>
    </div>



    <Dialog
    size="xs"
    open={modal === 'failed'}
    handler={handleCloseModal}
    className="bg-red shadow-none flex self-center w-auto"
    >
    <Card className="border-1 border-slate-200 w-full">
      <CardBody className="flex flex-col gap-6">
        <div className="relative">
            <div className="h-20 w-20  bg-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center pb-2">
                <img src={wrongSign} alt="Wrong Sign" />
            </div>
        </div>
        <Typography variant="h5" color="blue-gray" className="text-center mt-5">
            {'Invalid Session!'}
        </Typography>
        <div className="text-gray-600 font-medium text-center">
          Please try again.
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" color="bg-red-500" className="bg-red-500 text-white"  onClick={handleCloseModal} fullWidth>
            EXIT
        </Button>
      </CardFooter>
    </Card>
    </Dialog>
    </>
    )
}

export default CouponForm