import './App.css';
import { Button, Col, Container, Form, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function App() {


  // Menu pizze ordinabili
  const pizze = [
    { name: 'Margherita', price: 15 },
    { name: 'Marinara', price: 12 },
    { name: 'Capricciosa', price: 20 },
    { name: 'Diavola', price: 18 },
    { name: 'Bufala', price: 25 },
  ]

  // Lista Clienti al tavolo
  const [customers, setCustomers] = useState([]);




  // Cliente dal form
  const [clientForm, setClientForm] = useState({
    group: 1,
  });


  // Dati dal form
  const handleform = (e) => {
    let id = e.target.id;
    let value = e.target.id === 'pizza' ? e.target.value.split(' ')[0] : e.target.value;
    let price = e.target.id === 'pizza' ? e.target.value.split(' ')[1] : 0;



    if (price) {
      setClientForm({ ...clientForm, [id]: value, price: parseInt(price) });
    } else {

      if (id === 'fidality' || id === 'disability') {

        setClientForm({ ...clientForm, [id]: e.target.checked });
      } else {

        setClientForm({ ...clientForm, [id]: value });
      }
    }

  }





  function calcoloSconto(cliente) {

    let scontoPersonale = false;
    let scontoGruppo = false;
    let scount = {
      price: cliente.price,
      name: ''
    }

    // Controllo sconti personali
    if (cliente.fidality || cliente.disability) {
      scontoPersonale = true;
      scount.name += cliente.fidality ? 'Fidality 15%.' : '';
      scount.name += cliente.disability ? ' Disability 90%.' : '';
      scount.price = cliente.fidality ? scount.price - ((scount.price / 100) * 15) : scount.price;
      scount.price = cliente.disability ? scount.price - ((scount.price / 100) * 90) : scount.price;
    }

    // Controllo sconti per gruppi
    if (cliente.group >= 15) {
      scontoGruppo = true;

      if (cliente.group >= 15 && cliente.group <= 20) {
        scount.name += ' Group (15-20) 20%.';
        scount.price = scount.price - ((scount.price / 100) * 20);
      } else if (cliente.group >= 21 && cliente.group <= 25) {
        scount.name += ' Group (21-25) 30%.';
        scount.price = scount.price - ((scount.price / 100) * 30);
      } else if (cliente.group > 25) {
        scount.name += ' Group (+25) 50%.';
        scount.price = scount.price - ((scount.price / 100) * 50);
      }
    }

    // Controllo sconti orario, weekend e bambini
    if (!scontoPersonale && !scontoGruppo) {

      if (cliente.age < 12) {
        // Sconto Bambino 
        scount.name += cliente.age > 3 ? ' Bimbo < 12 20%.' : ' Bimbo < 4 50%.';
        scount.price = cliente.age > 3 ? scount.price - ((scount.price / 100) * 20) : scount.price - ((scount.price / 100) * 50);
      }
      let day = new Date().getDay();
      console.log(day)
      if (day === 0 || day === 5 || day === 6) {
        // Sconto Weekend
        scount.name += ' Weekend 10%.';
        scount.price = scount.price - ((scount.price / 100) * 10);
      } else {
        // Sconto ordinazione prima delle 20:00
        scount.name += ' Orario 10%.';
        if (new Date().getHours() < 20) {
          scount.price = scount.price - ((scount.price / 100) * 10);
        }
      }
    }


    // Sconto Anziano (+= 60 anni)
    if (cliente.age > 59) {
      scount.name += ' Età 60+ 70%.';
      scount.price = scount.price - ((scount.price / 100) * 70);
    }


    // Verifica del prezzo minimo della pizza
    scount.price = scount.price >= 5 ? scount.price : 5;
    return scount;
  }


  // Aggiunta ordinazione
  function addToTable(e) {
    e.preventDefault();
    let scount = calcoloSconto(clientForm);
    let newCli = { ...clientForm, price: scount.price, orario: new Date().toLocaleTimeString('it-IT'), scount: scount.name, date: new Date() };
    setCustomers([...customers, newCli]);
    setClientForm({});
    e.target.reset();

  }

  useEffect(() => {

  }, [customers])

  return (
    <>
      <Container fluid className='p-5 bg-secondary' style={{ height: '100vh' }}>
        <h1 className='text-center text-light'>Ordinazione pizze al tavolo</h1>


        <Container className='bg-light p-5 shadow rounded'>
          <h2>Ordina le tue pizze!</h2>
          <Form onSubmit={(e) => addToTable(e)}>
            <Form.Group className='row align-items-end'>
              <Col sm='3'>
                <Form.Label>Nome e Cognome</Form.Label>
                <Form.Control type='text' id='name' onChange={(e) => handleform(e)} defaultValue={clientForm.name} />
              </Col>
              <Col sm='1'>
                <Form.Label>Età</Form.Label>
                <Form.Control type='number' id='age' max={120} min={0} onChange={(e) => handleform(e)} defaultValue={clientForm.age} />
              </Col>
              <Col sm='1'>
                <Form.Label>Gruppo</Form.Label>
                <Form.Control type='number' id='group' max={80} min={1} onChange={(e) => handleform(e)} defaultValue={1} />
              </Col>
              <Col sm='2' className=''>
                <Form.Label>Diversamente abile</Form.Label>
                <Form.Check
                  type={'switch'}
                  id={`disability`}
                  onChange={(e) => handleform(e)}
                  onClick={(e) => handleform(e)}
                />
              </Col>
              <Col sm='2' className=''>
                <Form.Label>Fidelity Card</Form.Label>
                <Form.Check
                  type={'switch'}
                  id={`fidality`}
                  onChange={(e) => handleform(e)}
                  onClick={(e) => handleform(e)}
                />
              </Col>

              <Col sm='2'>
                <Form.Label>Seleziona Pizza</Form.Label>
                <Form.Select aria-label="Default select example" onChange={(e) => handleform(e)} id='pizza'>
                  <option>Seleziona la Pizza</option>
                  {
                    pizze.length > 0 && pizze.map((el, index) => {
                      return <option key={index}>{el.name} {el.price} €</option>
                    })
                  }
                </Form.Select>
              </Col>
              <Col sm='1' className='mt-1'>
                <Button type='submit'> Ordina</Button>
              </Col>
            </Form.Group>
          </Form>
        </Container>


        <Container>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nome e Cognome</th>
                <th>Età</th>
                <th>Gruppo</th>
                <th>Disabilità</th>
                <th>Fidelity Card</th>
                <th>Pizza</th>
                <th>Orario</th>
                <th>Sconto/i</th>
                <th>Prezzo €</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                customers && customers.map((el, index) => {
                  return <tr key={index}>
                    <td>{el.name}</td>
                    <td>{el.age}</td>
                    <td>{el.group || 1}</td>
                    <td>{el.disability ? 'Si' : 'No'}</td>
                    <td>{el.fidality ? 'Si' : 'No'}</td>
                    <td>{el.pizza}</td>
                    <td>{el.orario}</td>
                    <td>{el.scount || 'No'}</td>
                    <td>{el.price.toFixed(2)} €</td>
                    <td><Button variant='danger' className='rounded-circle' onClick={() => setCustomers(customers.filter((elem) => elem !== el))}>X</Button></td>
                  </tr>
                })
              }
              <tr>
                <td colSpan={8} className='text-center'>TOTAL</td>
                <td colSpan={2}>
                  {
                    customers.length > 0 && customers.reduce((accumulator, current) => accumulator + current.price, 0).toFixed(2)

                  } €
                </td>
              </tr>
            </tbody>
          </Table>
        </Container>
      </Container>

    </>
  );
}

export default App;
