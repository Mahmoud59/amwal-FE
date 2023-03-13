import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

function TableComponent() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [showModal, setShowModal] = useState(false);

    const handleModal = (item) => {
        if (item) {
          // Editing a user
          setFormData({ ...item });
        } else {
          // Adding a user
          setFormData({ name: '', email: '', phone: '' });
        }
        setShowModal(true);
      };
      
  
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.id) {
          // Editing a user
          axios.put(`http://127.0.0.1:8000/api/v1/foods/${formData.id}`, formData)
            .then(response => {
              const updatedData = data.map(item => item.id === formData.id ? formData : item);
              setData(updatedData);
              setShowModal(false);
            })
            .catch(error => console.log(error))
        } else {
          // Adding a user
          axios.post('http://127.0.0.1:8000/api/v1/foods/', formData)
            .then(response => {
              setData([...data, { ...response.data, id: data.length + 1 }]);
              setShowModal(false);
            })
            .catch(error => console.log(error))
        }
      };
    
    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/v1/foods/${id}`)
            .then(response => {
            const filteredData = data.filter(item => item.id !== id);
            setData(filteredData);
            })
            .catch(error => console.log(error))
        };
    
    const renderTableData = () => {
        return data.map((item, index) => {
            const { id, name, email, phone } = item;
            return (
            <tr key={id}>
                <td>{index + 1}</td>
                <td>{name}</td>
                <td>
                <Button variant="info" size="sm" onClick={() => handleModal(item)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>Delete</Button>{' '}
                </td>
            </tr>
            )
        })
        };
          
      
      
      
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/foods/')
      .then(response => setData(response.data['results']))
      .catch(error => console.log(error))
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TableComponent;
