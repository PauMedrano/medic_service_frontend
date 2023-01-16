import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Button, Container, Row, Col } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { AiOutlineDelete } from "@react-icons/all-files/ai/AiOutlineDelete";
import { AiOutlineEye } from "@react-icons/all-files/ai/AiOutlineEye";
import { AiOutlinePlus } from "@react-icons/all-files/ai/AiOutlinePlus";
import './index.css'
import { useState } from "react";
import { useEffect } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { ListItemSecondaryAction } from '@mui/material';
var stringSimilarity = require("string-similarity");

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function DataTable({ rows, columns, name, setInfo, setPatient, deleteFunc, handleView, modalContainer, addModal, hasAddbutton }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [searchValue, setSearchValue] = React.useState({});
  const [result, setResult] = React.useState([...rows]);
  const [rowsData, setRowsData] = useState([...rows]);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleAddOpen = () => setOpenAdd(true);
  const handleAddClose = () => setOpenAdd(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    setRowsData([...rows]);
    setResult([...rows]);
  }, [rows]);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    backgroundColor: 'transparent',
    outline: 'none'

  };

  const search_in_state = () => {
    if(searchValue.length === 0){
      setResult([...rowsData]);
    }else{

      const aux = rowsData.filter(item => {
        if(item.names == undefined)item.names = item.name + " " + item.last_name;

          const names = item.names.split(" ");
          var threshold = 0; 
          for(const i in names){
            threshold += stringSimilarity.compareTwoStrings(names[i], searchValue)
          }
          return threshold >= 0.3;

        
      });
      setResult([...aux]);
    }
  };
  return (

    <Container>
      <Modal
        open={openAdd}
        onClose={handleAddClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
      >
        <Box sx={style}>
          {addModal}
        </Box>
      </Modal>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backgroundColor: 'transparent', border: 'none', outline: 'none' }}
      >
        <Box sx={style}>
          {modalContainer}
        </Box>
      </Modal>
      <Row style={{ marginTop: '1rem' }}>
        <Col>
          <div className='oval_div'>
            <h3 style={{ marginRight: '1em' }}>{name}</h3>
            {hasAddbutton === true &&
              <Button variant="success" onClick={event => {
                handleAddOpen();
              }}>
                <AiOutlinePlus size={22} />
              </Button>
            }

            <Form.Control onChange={e => { setSearchValue(e.target.value) }} style={{ width: '50%', verticalAlign: 'middle', marginLeft: '1em', marginRight: '1em' }} placeholder="Buscar" />
            <Button variant="primary" onClick={() => {
              search_in_state()
            }
            }>Buscar</Button>
          </div>
        </Col>
      </Row>
      <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '1rem', 'text-align': 'center' }}>
        <TableContainer style={{ width: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{ backgroundColor: '#D5E4E6' }}>
              <TableRow style={{ backgroundColor: '#D5E4E6' }}>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, backgroundColor: '#D5E4E6', color: '#424242' }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                      {columns.slice(0, -1).map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.second_id !== undefined ?
                              <Button
                                variant="light"
                                style={{ width: '100%', height: '50px', background: '#abb1ba' }}
                                onClick={() => window.open("http://localhost:3000/patient/" + row['patient_id'], "_self")}
                              >
                                {value}
                              </Button> :
                              <>
                                {
                                  column.format
                                    ? column.format(value)
                                    : value
                                }
                              </>
                            }
                          </TableCell>
                        );
                      })}
                      <TableCell key="options">
                        <Button variant="primary" onClick={() => {
                          if (handleView !== null) {
                            handleView(row);
                          } else {
                            setInfo(row);
                            handleOpen();
                          }
                        }}>
                          <AiOutlineEye />
                        </Button>
                        <Button variant="danger" style={{ marginLeft: '1em' }} onClick={() => { deleteFunc(row['id']) }}>
                          <AiOutlineDelete />
                        </Button>
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}
