import React from 'react'
import { Form, FormGroup, Label, Input, Button, Col, FormText } from 'reactstrap'

const Profile = () => {
	return (
		<Form className='container mt-5'>
			<FormGroup row>
				<Label for='name' sm={2}>
					Name
				</Label>
				<Col sm={10}>
					<Input id='name' name='name' placeholder='name' type='text' />
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label for='exampleEmail' sm={2}>
					Email
				</Label>
				<Col sm={10}>
					<Input
						id='exampleEmail'
						name='email'
						placeholder='with a placeholder'
						type='email'
					/>
				</Col>
			</FormGroup>
			<FormGroup row>
				<Label for='examplePassword' sm={2}>
					Password
				</Label>
				<Col sm={10}>
					<Input
						id='examplePassword'
						name='password'
						placeholder='password placeholder'
						type='password'
					/>
				</Col>
			</FormGroup>

			<FormGroup row>
				<Label for='exampleFile' sm={2}>
					File
				</Label>
				<Col sm={10}>
					<Input id='exampleFile' name='file' type='file' />
					<FormText>
						This is some placeholder block-level help text for the above input. It's
						a bit lighter and easily wraps to a new line.
					</FormText>
				</Col>
			</FormGroup>

			<FormGroup check row>
				<Col
					sm={{
						offset: 2,
						size: 10,
					}}>
					<Button>Submit</Button>
				</Col>
			</FormGroup>
		</Form>
	)
}

export default Profile
