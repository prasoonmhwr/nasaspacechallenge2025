"use client";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-20">
      <div className="container mx-auto px-6 py-6 text-center text-white">
        <p>
          &copy; {new Date().getFullYear()} A World Away — NASA Space Apps Challenge Project.
        </p>
      </div>
    </footer>
  );
}
