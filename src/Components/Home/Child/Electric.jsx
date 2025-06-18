// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Card, Spinner } from 'react-bootstrap';
// import { FaPlus } from 'react-icons/fa';

// const ElectricGallery = () => {
//   const [electrics, setElectrics] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch electronics from backend
//   useEffect(() => {
//     axios.get('http://localhost:5000/api/products/electrics') // Replace with your backend URL
//       .then(response => {
//         setElectrics(response.data); // Assumes response is an array of electronics
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching electronics:', error);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div className="container py-4">
//       <h2 className="text-center mb-4">
//         <span className="text-muted">LATEST</span> <strong>ELECTRONICS</strong>
//       </h2>
//       <p className="text-center text-muted">
//         Explore the latest gadgets and devices in our collection.
//       </p>

//       {loading ? (
//         <div className="text-center my-5">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : (
//         <div className="row">
//           {electrics.length === 0 ? (
//             <div className="col-md-3 col-sm-6 mb-4">
//               <Card
//                 className="add-card-custom shadow-sm border-0 d-flex align-items-center justify-content-center"
//                 style={{ height: '250px', backgroundColor: '#f0f0f0' }}
//               >
//                 <div className="text-center">
//                   <FaPlus size={36} className="text-secondary" />
//                   <p className="mt-2 text-secondary">Add Component</p>
//                 </div>
//               </Card>
//             </div>
//           ) : (
//             electrics.map((item, index) => (
//               <div key={index} className="col-md-3 col-sm-6 mb-4">
//                 <Card className="h-100 shadow-sm">
//                   <Card.Img
//                     variant="top"
//                     src={item.image}
//                     style={{ height: '250px', objectFit: 'cover' }}
//                   />
//                   <Card.Body className="text-center">
//                     <Card.Title className="fs-6">{item.name}</Card.Title>
//                     <Card.Text className="fw-bold">${item.price}</Card.Text>
//                   </Card.Body>
//                 </Card>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ElectricGallery;
