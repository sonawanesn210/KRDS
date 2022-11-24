const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")

const mongoose = require('mongoose')





const isValidISBN = (ISBN) => {
  return String(ISBN).trim().match(/^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/)
}


//.............................................POST/books........................................................


const createBook = async (req, res) => {
  try {
   const data = req.body;



    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Please Enter Some Details" });
    }
    
    let {title,userId,ISBN,category,isDeleted} =data
    if (!title) {
      return res.status(400).send({ status: false, message: "Title is missing" });
    }
    
    const findtitle = await bookModel.findOne({ title: title })

    if (findtitle) {
      return res.status(400).send({ status: false, message: `${title} Already Exist.Please,Give Another Title` })
    }

    
    if (!userId)
      return res.status(400).send({ status: false, message: "userId not given" })
    
    let isValiduserId = mongoose.Types.ObjectId.isValid(userId);  //return true or false


    if (!isValiduserId) {
      return res.status(400).send({ status: false, message: "userId is Not Valid" });
    }

    const finduserId = await userModel.findById(userId) //give whole data

    if (!finduserId) {
      return res.status(404).send({ status: false, message: "userId not found" })
    }
    if (!ISBN)
      return res.status(400).send({ status: false, message: "ISBN not given" })
  


    if (!isValidISBN(ISBN)) {
      return res.status(400).send({ status: false, message: "INVALID ISBN", });
    }
    const findISBN = await bookModel.findOne({ ISBN: ISBN })  //gives whole data


    if (findISBN) {
      return res.status(400).send({ status: false, message: `${ISBN} Already Exist.Please,Give Another ISBN` })

    }

    if (category) {
    

    if (!validatefeild(category)) {
      return res.status(400).send({ status: false, message: "category must contain Alphabet or Number", });
    }

  }
    if (isDeleted) {
      obj.isDeleted = isDeleted
      if (typeof (isDeleted) != "boolean") {
        return res.status(400).send({ status: false, message: "Invalid Input of isDeleted.It must be true or false " });
      }
      if (isDeleted == true) {
        return res.status(400).send({ status: false, message: "isDeleted must be false while creating book" });
      }
    }

   const obj={
    title:title,
    userId:userId,
    ISBN:ISBN,
    category:category
   }

    const Books = await bookModel.create(obj);
    return res.status(201).send({ status: true, message:"Success",data:Books });

  }
  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


//----------------------------------------------------------------------------------------//

const getbooks = async function (req, res) {  //get books using filter query params
  try {
    const title= req.query.title;
    const ISBN = req.query.ISBN;
 
    const obj = {
      isDeleted: false,

    };
    if (title)
      obj.title = title;
    if (ISBN)
      obj.ISBN = ISBN;
   

    
    const bookdata = await bookModel.find(obj).sort({ title: 1 })
    if (bookdata.length == 0) {
      return res.status(404).send({ status: false, message: "Books not found" });
    }
    res.status(200).send({ status: true, message: "Books list", data: bookdata });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

//------------------------------------------------------------------------------------------//

const addToList = async (req, res) => {
  try {
      let userId = req.params.id
      let data = req.body

     if (!data.bookId) return res.status(400).json({ message: "body is empty, provide bookId  to add in your list" })
      const book = await bookModel.findById(data.bookId)
      if (!book) return res.status(404).send({ message: "No book found" })
      const bookId = book._id

      const list = await userModel.findOneAndUpdate(
          { _id: userId },
          { $push: { list: bookId } }, { new: true })

      return res.status(201).json({ data: list, message: "Book added to your personal list" })
  } catch (err) {
      res.status(500).send({ message: err.message })
  }
}


module.exports={createBook,getbooks,addToList}