import * as React from 'react';
import { BrowserRouter as Router, Routes, Route ,useLocation} from 'react-router-dom';
import PageWrapper from './PageWrapper';
import { useNavigate } from 'react-router-dom';
import { Button,Box, Typography } from '@mui/joy';




export default function SeedPhrase() {
    const navigate = useNavigate(); // For navigation
    const handleButtonClick = () => {
        navigate('/create-account'); // Redirects to the signup page
    }
    const handleButtonClick1 = () => {
        navigate('/create-account'); // Redirects to the signup page
    }
    const wordList = [
        'abandon', 'flame', 'able', 'sack', 'above', 'film', 'absorb', 
        'stuff', 'absurd', 'chemical', 'access', 'peace', 'account', 'tan', 
        'achieve', 'envious', 'acoustic', 'overrated', 'across', 'unruly', 'action', 
        'actor', 'rinse', 'actual', 'adapt', 'add', 'addict', 'address', 
        'adjust', 'admit', 'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford'
      ];
    
      const [words, setWords] = React.useState([]);
    
      React.useEffect(() => {
        // Generate 12 random words
        const shuffled = [...wordList].sort(() => 0.5 - Math.random());
        setWords(shuffled.slice(0, 12));
      }, []);

  return (
    <PageWrapper>
    <div className="page_container" 
        style={{ display: 'flex', 
                flexDirection: 'column',
                height: '100dvh',
                padding: '0rem 1.2rem 0rem 1.2rem',
                gap:'2rem',
                // padding:'0rem 1.5rem 0rem 1.5rem',
                justifyContent: 'center',
                
                // overflowY:'hidden', 
                // border:'3px solid white'
            }}>

        <p onClick={handleButtonClick} className="logo1" 
                style={{ fontSize:'0.9rem'}}>
                Go<span> back</span>
        </p>               

        <div className='mid-seed' style={{display: 'flex', flexDirection: 'column', gap:'1.5rem'}}>
        <h3 style={{ display: 'flex', 
                      flexDirection: 'column',
                      padding:'0.5rem 0rem 0.5rem ' 
                    }}>
                    Write down your Seed Phrase 
        </h3>

        <p  
          style={{color:'#BAB8B8', 
                //   fontWeight:'200',
                  textAlign:'justify',
                  fontSize:'1.05rem'
                  }}>
          Don't risk losing your funds. Protect your wallet by saving your seed phrase in a place you trust.
          It's the only way to recover your wallet if you get locked out of the app or get a new device.
        </p>
        

        <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 0.5,
        // width: '90%', 
        // maxWidth: '600px',
        // p: 2,
        border: '1px solid rgba(22, 236, 111, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#112240',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}>
      {words.map((word, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            // p: 1,
            textAlign: 'center',
            backgroundColor: '#0A192F',
            borderRadius: '4px',
            border: '1px solid rgba(22, 236, 111, 0.15)',
            minHeight: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <Typography 
            level="body-xs" 
            sx={{ 
              color: '#16ec6f', 
              position: 'absolute',
              top: '11px',
              left: '6px',
              opacity: 0.8
            }}
          >
            {index + 1}.
          </Typography>
          <Typography
            component="span"
            sx={{
              color: '#FFFFFF',
              fontSize: '0.9rem',
            //   pl: 2.5,
            //   pr: 1,
            //   wordBreak: 'break-word'
            }}
          >
            {word}
          </Typography>
        </Box>

      ))}
       
    </Box>
    <Button onClick={handleButtonClick1}
        type="submit" 
        fullWidth 
        variant="solid" 

        sx={{ 
            marginTop:'1rem',
             height:'6vh',
            //  marginBottom:'9rem',
            backgroundColor: '#16ec6fef', 
            color: '#0A192F', 
            '&:hover': { backgroundColor: '#14d461' },
           
        }}
        >
        Done
        </Button>
        </div>
    </div>
    </PageWrapper>
  )
}
