import React from "react";
import { useForm } from "react-hook-form";

export default function SubmissionForm() {
    // Using react-hook-form to manage form state
    const { register, handleSubmit } = useForm<FormData>();

    // Defining the FormData interface for type safety
    interface FormData {
        title: string;
        authors: string;
        source: string;
        pubyear: string;
        doi: string;
        linked_discussion: string;
    }
    
    // Function to handle form submission
    const onSubmit = (data: FormData) => JSON.stringify(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("title")} placeholder="Title" />
            <p>
                <input {...register("authors")} placeholder="Authors" />
            </p>
            <p>
                <input {...register("source")} placeholder="Source" />
            </p>
            <p>
                <input {...register("pubyear")} placeholder="Publication Year" />
            </p>
            <p>
                <input {...register("doi")} placeholder="DOI" />
            </p>

            <select {...register("linked_discussion")}>
                <option value="">Select SE practice...</option>
                <option value="TDD">TDD</option>
                <option value="Mob Programming">Mob Programming</option>
            </select>
            <input type="submit" />
        </form>
    );
}
