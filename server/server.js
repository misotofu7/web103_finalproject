import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import cors from 'cors'

// import the router from your routes file
// import router from './routes/route.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'lightning.png')))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'lightning.png')))
    app.use(express.static('public'))
}

// specify the api path for the server to use
// app.use('/api', router);

// const advisors = [
//   {
//     id: 1,
//     name: "Aisha Patel",
//     university: "New York University",
//     specialty: "Computer Science",
//     department: "Tandon School of Engineering",
//     rating: 4.8,
//   },
//   {
//     id: 2,
//     name: "Daniel Kim",
//     university: "New York University",
//     specialty: "Pre-Health",
//     department: "College of Arts and Science",
//     rating: 4.5,
//   },
//   {
//     id: 3,
//     name: "Maria Gonzalez",
//     university: "New York University",
//     specialty: "Business and Finance",
//     department: "Stern School of Business",
//     rating: 4.7,
//   },
// ];

// app.get("/api/universities/:universityName/advisors", (request, response) => {
//   const universityName = request.params.universityName.toLowerCase();

//   const matchingAdvisors = advisors.filter(
//     (advisor) => advisor.university.toLowerCase() === universityName,
//   );

//   response.json(matchingAdvisors);
// });

// app.get("/api/advisors/:id", (request, response) => {
//   const advisor = advisors.find(
//     (currentAdvisor) => currentAdvisor.id === Number(request.params.id),
//   );

//   if (!advisor) {
//     return response.status(404).json({ error: "Advisor not found" });
//   }

//   response.json(advisor);
// });

if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
