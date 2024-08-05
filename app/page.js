"use client";

import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  TextField,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (name) => {
    const docRef = doc(collection(firestore, "inventory"), name || itemName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: 1, category: selectedCategory });
    }

    await updateInventory();
    setItemName("");
    setSelectedCategory("");
    handleClose();
  };

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, "inventory"), name);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory ? item.category === selectedCategory : true)
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
      bgcolor="#f4f4f9"
      padding={2}
    >
      <Typography variant="h4" color="#2c3e50" marginBottom={2}>
        Inventory Management
      </Typography>

      <TextField
        variant="outlined"
        label="Search by Name"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          label="Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Furniture">Furniture</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
          <MenuItem value="Books">Books</MenuItem>
        </Select>
      </FormControl>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius={3}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" color="#2c3e50">
            Add Item
          </Typography>
          <TextField
            variant="outlined"
            label="Item Name"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => addItem(itemName)}
            sx={{ textTransform: "none" }}
          >
            Add
          </Button>
        </Box>
      </Modal>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{
          padding: "10px 20px",
          borderRadius: "8px",
          textTransform: "none",
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "#1abc9c",
          },
        }}
      >
        Add New Item
      </Button>

      <Box
        border="1px solid #ccc"
        borderRadius={4}
        width="100%"
        maxWidth="1000px"
        maxHeight="500px"
        overflow="auto"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        bgcolor="white"
        marginTop={2}
      >
        <Box
          width="100%"
          height="60px"
          bgcolor="#2980b9"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px 4px 0 0"
          color="white"
        >
          <Typography variant="h6">Inventory</Typography>
        </Box>

        <Stack
          direction="column"
          spacing={2}
          padding={2}
        >
          {filteredInventory.map(({ name, quantity, category }) => (
            <Box
              key={name}
              width="100%"
              minHeight="120px"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              bgcolor="#ecf0f1"
              padding="10px 20px"
              borderRadius={2}
              boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
              marginBottom={2}
            >
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography
                  variant="body2"
                  color="#7f8c8d"
                >
                  Category: {category}
                </Typography>
                <Typography
                  variant="body2"
                  color="#7f8c8d"
                >
                  Quantity: {quantity}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                color="#2c3e50"
                marginBottom={1}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => addItem(name)}
                  sx={{ textTransform: "none" }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                  sx={{ textTransform: "none" }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
