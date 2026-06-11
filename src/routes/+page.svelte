<main class="flex min-h-screen flex-col gap-2 bg-gray-100">
	<header class="flex items-center gap-56 bg-gray-200 px-8 -mx-6 h-30">
		<div>
			<a href="/" class="text-5xl font-bold ml-10">WAYNE ENTERPRISES</a>
			<p class="text-gray-600 ml-10">Future Through Innovation</p>
		</div>

		<a href="/about" class="underline decoration-solid hover:decoration-dotted text-gray-800">About Us</a>
		<a href="/products" class="underline decoration-solid hover:decoration-dotted text-gray-800">View Our Products</a>
		<a href="/contact" class="underline decoration-solid hover:decoration-dotted text-gray-800">Contact Us</a>
		<a href="/newsroom" class="underline decoration-solid hover:decoration-dotted text-gray-800">Newsroom</a>
	</header>

	<div class="flex-1 flex items-center justify-center gap-8 px-8">
		<div class="w-125 h-87.5 overflow-hidden">
			<img
				src="/batmobile.jpg"
				alt="Batmobile"
				class="w-full h-full object-cover object-center batmobile-fade"
			>
		</div>

		<div class="max-w-160 space-y-4 leading-relaxed text-gray-700 px-6 p-8">
			<p>Wayne Enterprises is dedicated to saving our planet, and we are proud to stand behind that mission every single day. I want to personally thank you for placing your trust in us. It is a responsibility we do not take lightly.</p>

			<p>Every advancement we make is driven by a simple belief: that progress should serve people, not the other way around. Gotham has never been an easy place to build a future in, but it is home. And it always will be worth fighting for.</p>

			<p>On behalf of everyone at Wayne Enterprises, thank you for being part of what comes next.</p>

			<div class="mt-6 text-left">
				<p class="font-medium text-gray-900">— Bruce Wayne</p>
				<p class="mt-1 text-sm text-gray-500 italic">Chief Executive Officer, Wayne Enterprises</p>
			</div>
		</div>
	</div>

	<div class="fixed bottom-3 right-4 group">
		<footer class="text-gray-400 opacity-0 group-hover:opacity-100 transition">
			<a href="/internal" class="text-gray-400 text-xs">internal</a>
		</footer>
	</div>
</main>

<style>
.batmobile-fade {
	mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}
</style>