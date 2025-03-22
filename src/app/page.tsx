"use client";

import { useEffect, useState } from "react";

type Course = {
  id: number;
  institutionId: number;
  courseTypeId: number;
  description: string;
};

type Subject = {
  id: number;
  courseId: number;
  subjectTypeId: number;
  acronym: string;
  description: string;
  period: number;
  workload: number;
};

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API;

  const [courseId, setCouseId] = useState<number>(-1);
  const [courses, setCourses] = useState<Course[]>();
  const [loadingCourses, setLoadingCourses] = useState<Boolean>(true);

  const [subjects, setSubjects] = useState<Subject[]>();
  const [loadingSubjects, setLoadingSubjects] = useState<Boolean>(false);

  async function getCouses() {
    await fetch(`${baseUrl}/course`)
      .then((response) => response.json())
      .then((data) => setCourses(data));

    setLoadingCourses(false);
  }

  async function getSubjects() {
    await fetch(`${baseUrl}/subject/course/${courseId}`)
      .then((response) => response.json())
      .then((data) => setSubjects(data));

    setLoadingSubjects(false);
  }

  useEffect(() => {
    if (loadingCourses) {
      getCouses();
    }

    if (loadingSubjects) {
      getSubjects();
    }
  }, [loadingSubjects]);

  return (
    <>
      <header className="flex justify-center p-4 border-b-[.5px] border-zinc-600">
        <h1 className="text-xl font-bold">
          MESTRE DETALHE: DISCIPLINAS X CURSOS
        </h1>
      </header>
      <main className="flex flex-col items-center w-full h-[85vh] mt-6 gap-16">
        <div className="flex flex-col gap-2 w-[60vw] items-center h-[50px]">
          <label htmlFor="cursos" className="font-bold text-xl">
            CURSOS
          </label>
          <select
            name="cursos"
            id="cursos"
            value={courseId}
            onChange={(event) => {
              setCouseId(+event.target.value);
              if (+event.target.value !== -1) {
                setLoadingSubjects(true);
              } else {
                setSubjects(undefined);
              }
            }}
            className="flex text-lg text-center min-w-full p-2 rounded-lg bg-transparent border border-zinc-500"
          >
            <option value={-1} className="bg-zinc-950">
              Selecione um curso
            </option>
            {courses?.map((course: Course) => {
              return (
                <option
                  value={course.id}
                  key={course.id}
                  className="bg-zinc-950"
                >
                  {course.description}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col text-center w-full">
          <label htmlFor="disciplinas" className="font-bold text-xl">
            DISCIPLINAS
          </label>
          <table className="flex flex-col w-full p-10">
            <thead className="flex w-full justify-around">
              <tr className="flex w-full justify-around border border-zinc-500 p-2">
                <th className="w-1/12">ID</th>
                <th className="w-1/12">Sigla</th>
                <th className="w-7/12">Descrição</th>
                <th className="w-1/12">Período</th>
                <th className="w-1/6">Carga Horária</th>
              </tr>
            </thead>
            <tbody>
              {!subjects && (
                <tr className="flex w-full items-center justify-center p-2 text-xl">
                  <td>Selecione um curso para visualizar as disciplinas</td>
                </tr>
              )}

              {subjects?.length === 0 && (
                <tr className="flex w-full items-center justify-center p-2 text-xl">
                  <td>Não há disciplinas cadastradas para o curso selecionado</td>
                </tr>
              )}

              {subjects &&
                subjects.map((subject, index) => {
                  return (
                    <tr className={`flex w-full justify-around border border-zinc-500 p-2 ${index%2 === 0 && "bg-zinc-900"}`}key={subject.id}>
                      <td className="flex items-center justify-center w-1/12">
                        {subject.id}
                      </td>
                      <td className="flex items-center justify-center w-1/12">
                        {subject.acronym}
                      </td>
                      <td className="flex items-center justify-center w-7/12">
                        {subject.description}
                      </td>
                      <td className="flex items-center justify-center w-1/12">
                        {subject.period}
                      </td>
                      <td className="flex items-center justify-center w-1/6">
                        {subject.workload}h
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
