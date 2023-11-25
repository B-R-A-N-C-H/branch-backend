import { PrismaClient, Student } from '@prisma/client';

const prisma = new PrismaClient();

// Retrieves all students from the database.
export async function getAllStudents() {
  const allStudents = await prisma.student.findMany();
  console.log(allStudents);
  await prisma.$disconnect();
}



// Retrieves a specific student by their ID.
export async function getStudentById(studentId: string) {
  const student = await prisma.student.findUnique({
    where: {
      id: studentId
    }
  });
  console.log(student);
  await prisma.$disconnect();
}



// Updates an existing student with new data.
export async function updateStudent(studentId: string, updatedData: Partial<Student>) {
  try {
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: updatedData
    });
    console.log('Student record updated:', updatedStudent);
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}




// Deletes a student from the database.
export async function deleteStudent(studentId: string) {
  try {
    await prisma.student.delete({
      where: {
        id: studentId
      }
    });
    console.log('Student deleted');
    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

