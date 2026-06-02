<script>
	import { onMount } from 'svelte';

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
		return '';
	}

	onMount(() => {
		const access = getCookie('wayne_access_ceo');
		if (access !== 'true') {
			window.location.href = '/';
		}
	});
</script>

<main class="h-full bg-gray-50">
	<h1>Wayne Internal Dashboard</h1>
	<p>
		Welcome, Bruce Wayne. Here you can access all internal resources and information related to
		Wayne Enterprises.
	</p>
	<h2>sitenav:</h2>
	<br /> <a href="/wayne/ceo" class="text-blue-500 hover:underline">CEO's Office</a> <br />
	<p class="text-gray-400">Financial Reports (You are here)</p>
	<a href="/wayne/ceo/comms" class="text-blue-500 hover:underline">Communication Center</a> <br />
    <br /> <br /> <br />
	<div class="mx-auto w-[900px]">
		<!-- HEADER -->
		<header class="mb-8">
			<h1 class="text-3xl font-bold tracking-wide text-center">FINANCIAL ANALYTICS</h1>
		</header>

		<!-- KPI CARDS -->
		<section class="mb-8 grid grid-cols-2 gap-4">
			<div class="rounded border bg-white p-5">
				<h3 class="text-xs text-gray-500">TOTAL REVENUE</h3>
				<p class="text-2xl font-bold">$48.2B</p>
				<div class="mt-2 h-1 w-[78%] bg-green-500"></div>
			</div>

			<div class="rounded border bg-white p-5">
				<h3 class="text-xs text-gray-500">NET PROFIT</h3>
				<p class="text-2xl font-bold text-green-600">$12.7B</p>
				<div class="mt-2 h-1 w-[62%] bg-green-400"></div>
			</div>

			<div class="rounded border bg-white p-5">
				<h3 class="text-xs text-gray-500">R&D EXPENDITURE</h3>
				<p class="text-2xl font-bold">$9.4B</p>
				<div class="mt-2 h-1 w-[55%] bg-blue-500"></div>
			</div>

			<div class="rounded border bg-white p-5">
				<h3 class="text-xs text-gray-500">GLOBAL ASSETS</h3>
				<p class="text-2xl font-bold">$120B+</p>
				<div class="mt-2 h-1 w-[90%] bg-purple-500"></div>
			</div>
		</section>

		<!-- VISUAL CHART (FAKE BUT EFFECTIVE) -->
		<section class="mb-8 rounded border bg-white p-5">
			<h2 class="mb-4 text-lg font-bold">QUARTERLY PERFORMANCE</h2>

			<div class="flex h-40 items-end gap-2">
				<div class="h-[40%] w-10 bg-gray-300"></div>
				<div class="h-[55%] w-10 bg-gray-400"></div>
				<div class="h-[65%] w-10 bg-gray-500"></div>
				<div class="h-[70%] w-10 bg-gray-600"></div>
				<div class="h-[85%] w-10 bg-green-500"></div>
			</div>

			<p class="mt-3 text-sm text-gray-500">+8.4% growth compared to previous quarter</p>
		</section>

		<!-- REVENUE BREAKDOWN -->
		<section class="mb-8 rounded border bg-white p-5">
			<h2 class="mb-4 text-lg font-bold">REVENUE SOURCES</h2>

			<div class="space-y-3 text-sm">
				<div class="flex justify-between border-b pb-2">
					<span>Defense Technology</span>
					<span>$18.4B</span>
				</div>

				<div class="flex justify-between border-b pb-2">
					<span>Wayne Tech</span>
					<span>$15.1B</span>
				</div>

				<div class="flex justify-between border-b pb-2">
					<span>Infrastructure</span>
					<span>$7.8B</span>
				</div>

				<div class="flex justify-between">
					<span>Other Investments</span>
					<span>$6.9B</span>
				</div>
			</div>
		</section>

		<!-- EXPENSES -->
		<section class="mb-8 rounded border bg-white p-5">
			<h2 class="mb-4 text-lg font-bold">MAJOR EXPENSES</h2>

			<ul class="space-y-2 text-sm text-gray-700">
				<li>• R&D Labs — $3.2B</li>
				<li>• Security Infrastructure — $2.1B</li>
				<li>• Global Operations — $4.5B</li>
				<li>• Wayne Foundation Projects — $1.8B</li>
			</ul>
		</section>
	</div>
</main>
