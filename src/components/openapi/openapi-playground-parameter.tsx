"use client";

import type { FormType } from "@/components/openapi/openapi-playground";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import type { OpenAPIV3 } from "@/lib/openapi";
import type { FieldApi, ReactFormExtendedApi } from "@tanstack/react-form";

const TextField = ({ field }: { field: FieldApi<FormType, string> }) => {
	return (
		<Input
			id={field.name}
			value={field.state.value as string}
			name={field.name}
			onBlur={field.handleBlur}
			required={false}
			placeholder={field.name}
			onChange={(e) => {
				field.handleChange(e.target.value);
			}}
		/>
	);
};

const SelectField = ({
	field,
	values,
}: { field: FieldApi<FormType, string>; values: string[] }) => {
	return (
		<NativeSelect
			id={field.name}
			value={field.state.value as string}
			name={field.name}
			onBlur={field.handleBlur}
			required={false}
			onChange={(e) => {
				const value = e.target.value;
				if (value === "--") {
					field.handleChange("");
					return;
				}
				field.handleChange(value);
			}}
		>
			{values.map((value) => (
				<option key={value} value={value}>
					{value}
				</option>
			))}
		</NativeSelect>
	);
};

export const ParameterField = ({
	param,
	form,
}: {
	param: OpenAPIV3.ParameterObject;
	form: ReactFormExtendedApi<FormType>;
}) => {
	const schema = param.schema as OpenAPIV3.SchemaObject;
	if (!schema) return null;

	const fieldId = `playground-field-${param.name}`;

	const InputField = ({ field }: { field: FieldApi<FormType, string> }) => {
		switch (schema.type) {
			case "boolean":
				return (
					<SelectField
						field={field}
						values={
							param.required ? ["true", "false"] : ["--", "true", "false"]
						}
					/>
				);
			default:
				return <TextField field={field} />;
		}
	};

	return (
		<div className="max-w-96">
			<FormLabel htmlFor={fieldId} required={param.required}>
				{param.name}
			</FormLabel>
			<form.Field name={param.name}>
				{(field) => <InputField field={field} />}
			</form.Field>
		</div>
	);
};
