# Interoperable System for COVID 19

## Introduction
The Interoperable Healthcare System for COVID is a project that aims to create a comprehensive and interoperable solution for managing patient medical and demographic data related to COVID-19. It leverages various standards and technologies such as OpenEHR, FHIR, and SNOMED CT to ensure seamless integration and data exchange between different healthcare systems. The project is built using Svelte, SCSS, EHRbase, HapiFHIR Svelte, TypeScript, PostgreSQL, Tailwind CSS, and Shoelace Style.

## Project Overview
The project consists of several components and technologies working together to achieve interoperability and efficient management of healthcare data. The main components are:

- Svelte: A JavaScript framework used for building the user interface and creating interactive components. Svelte provides a reactive approach to building web applications.

- SCSS: A popular CSS preprocessor that extends the capabilities of traditional CSS. SCSS allows for more maintainable and modular styling of the application.

- EHRbase: A powerful open-source database for storing electronic health records (EHRs) based on the OpenEHR standard. EHRbase provides a flexible and scalable solution for managing patient medical data.

- HapiFHIR Svelte: A Svelte library that enables communication with FHIR servers. FHIR (Fast Healthcare Interoperability Resources) is a standard for exchanging healthcare information electronically.

- TypeScript: A typed superset of JavaScript that adds static types to the language, improving code reliability and maintainability.

- PostgreSQL: A robust open-source relational database management system used for storing patient demographic data.

- Tailwind CSS: A utility-first CSS framework that provides pre-defined styles and classes to speed up the styling process and maintain consistency across the application.

- Shoelace Style: A lightweight CSS framework that provides a minimal set of styles and components to enhance the user interface.

## System Architecture
The Interoperable Healthcare System for COVID follows a modular and scalable architecture. The key components and their interactions are as follows:

![image](https://github.com/mezeru/ISCov-19/assets/57724250/fa4f639c-5371-4fd6-9619-9a7d395c62c5)


- meblocks-ui: A library built on top of Svelte that facilitates the creation of OpenEHR templates for creating assessment forms. It provides a user-friendly interface for designing and customizing the templates.

- OpenEHR Templates: The assessment forms created using meblocks-ui are based on the OpenEHR standard. These templates define the structure and content of the data collected during assessments.

- EHRbase: The EHRbase database stores the patient medical data using the OpenEHR standard. The assessment forms created with meblocks-ui are used to capture and store the data in a structured manner. EHRbase ensures data integrity, persistence, and efficient querying capabilities.

- HapiFHIR: For organizations that prefer not to use FHIR, a backend is created to handle the data exchange and storage. HapiFHIR is used as the server-side component to manage the communication between the frontend and the backend. It facilitates the storage of patient demographic data and ensures interoperability with other healthcare systems.

- EHRid: The EHRid serves as a unique identifier that links the patient medical data stored in EHRbase with the patient demographic data stored in HapiFHIR. This identifier enables the seamless integration of the two databases and ensures that the complete patient record is accessible when needed.
