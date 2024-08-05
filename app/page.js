"use client";

import { useState, useEffect } from "react";
import { firestore, auth } from "@/firebase"; // Ensure Firebase is correctly initialized
import {
  Box,
  Modal,
  TextField,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  where,
} from "firebase/firestore";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(""); // Added state for category
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        updateInventory();
      } else {
        setInventory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateInventory = async () => {
    if (!user) return;

    const snapshot = query(
      collection(firestore, "inventory"),
      where("userId", "==", user.uid) // Filter items by user ID
    );
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, category) => {
    if (!user) return;

    const docRef = doc(collection(firestore, "inventory"));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 }, { merge: true });
    } else {
      await setDoc(docRef, { name: item, category, quantity: 1, userId: user.uid });
    }

    await updateInventory();
  };

  const removeItem = async (itemId) => {
    const docRef = doc(firestore, "inventory", itemId);
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

  const handleLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Sign up failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
      bgcolor="#f4f4f9"
      padding={3}
    >
      <Typography variant="h4" color="#2c3e50" marginBottom={2}>
        Inventory Management
      </Typography>

      {!user ? (
        <Box>
          <TextField
            variant="outlined"
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            variant="outlined"
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button onClick={() => handleLogin(email, password)}>Login</Button>
          <Button onClick={() => handleSignUp(email, password)}>Sign Up</Button>
        </Box>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
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

          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "300px", margin: "20px 0" }}
          />

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
                fullWidth
                label="Item Name"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              />
              <Select
                variant="outlined"
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Furniture">Furniture</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addItem(itemName, category);
                  setItemName("");
                  setCategory("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Box>
          </Modal>

          <Box
            border="1px solid #ccc"
            borderRadius={4}
            width="800px"
            maxHeight="500px"
            overflow="auto"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          >
            <Box
              width="100%"
              height="100px"
              bgcolor="#2980b9"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="4px 4px 0 0"
              color="white"
            >
              <Typography variant="h2">Inventory</Typography>
            </Box>

            <Stack
              width="100%"
              spacing={2}
              padding={3}
            >
              {filteredInventory.map(({ id, name, category, quantity }) => (
                <Box
                  key={id}
                  width="100%"
                  minHeight="100px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#ecf0f1"
                  padding="10px 20px"
                  borderRadius={2}
                  boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
                >
                  <Typography
                    variant="h6"
                    color="#2c3e50"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography
                    variant="h6"
                    color="#2c3e50"
                  >
                    {category}
                    </Typography>
                  <Typography
                    variant="h6"
                    color="#2c3e50"
                  >
                    Quantity: {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addItem(name, category)}
                    >
                      Add
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeItem(id)}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}

