/**
 * @jest-environment jsdom
 */

import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import Btn from './Component';

beforeEach(() => {
	let timesCalled = 0;

	// @ts-ignore
	window.fetch = jest.fn(() => {
		timesCalled++;

		switch (timesCalled) {
			case 1:
				return Promise.resolve({ json: () => Promise.resolve({ test: 'data' }) });
			case 2:
				return Promise.resolve({ json: () => Promise.resolve({ test: 'data2' }) });
		}
	});
});

describe('Component', () => {
	it('should render', async () => {
		const wrapper = render(<Btn />);

		expect(window.fetch).toHaveBeenCalledTimes(0);

		const btn = await wrapper.findByText('Click me!');

		btn.click();

		expect(window.fetch).toHaveBeenCalledTimes(1);

		cleanup();
	});

	it('should fetch data properly', async () => {
		const wrapper = render(<Btn />);

		const btn = await wrapper.findByText('Click me!');

		await act(() => {
			btn.click();

			return new Promise((resolve) => {
				setTimeout(() => resolve(), 0);
			});
		});

		const elem = wrapper.container.firstChild!.firstChild as HTMLElement;

		expect(window.fetch).toHaveBeenCalledTimes(1);
		expect(elem.tagName).toBe('PRE');
		expect(elem.textContent).toBe('{\n    "test": "data"\n}');

		cleanup();
	});

	it('should fetch data properly twice', async () => {
		const wrapper = render(<Btn />);

		const btn = await wrapper.findByText('Click me!');

		await act(() => {
			btn.click();
			btn.click();

			return new Promise((resolve) => {
				setTimeout(() => resolve(), 0);
			});
		});

		const elem = wrapper.container.firstChild!.firstChild as HTMLElement;

		expect(window.fetch).toHaveBeenCalledTimes(2);
		expect(elem.tagName).toBe('PRE');
		expect(elem.textContent).toBe('{\n    "test": "data2"\n}');

		cleanup();
	});
});
