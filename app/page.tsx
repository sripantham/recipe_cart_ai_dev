'use client'

import React, { useState } from 'react'
import { Loader2, ChefHat, ShoppingCart, Sparkles } from 'lucide-react'
import { ThemeToggle } from './components/theme-toggle'

interface GroceryItem {
  item: string
  quantity: string
}

const HomePage: React.FC = () => {
  const [recipe, setRecipe] = useState('')
  const [groceries, setGroceries] = useState<GroceryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recipe.trim()) {
      setError('Please enter a recipe')
      return
    }

    setLoading(true)
    setError('')
    setSubmitted(true)

    try {
      const response = await fetch('/api/groceries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipe }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process recipe')
      }
      
      if (!data.groceries || !Array.isArray(data.groceries)) {
        throw new Error('Invalid response format')
      }

      setGroceries(data.groceries)
    } catch (err: any) {
      setError(err.message || 'Failed to generate grocery list. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle />
      
      <main className="container mx-auto p-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <ChefHat className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Recipe Cart
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
              Transform your recipes into organized shopping lists with AI-powered ingredient extraction
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recipe" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Recipe
                </label>
                <div className="relative">
                  <textarea
                    id="recipe"
                    value={recipe}
                    onChange={(e) => setRecipe(e.target.value)}
                    placeholder="Paste your recipe here... (e.g., 2 cups flour, 1 cup sugar, 3 eggs...)"
                    className="w-full h-48 p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors duration-300"
                    required
                  />
                  <Sparkles className="absolute right-3 top-3 h-5 w-5 text-blue-500 opacity-50" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !recipe.trim()}
                className="w-full bg-blue-600 dark:bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Processing Recipe...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>Generate Grocery List</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl animate-fadeIn">
              {error}
            </div>
          )}

          {groceries.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Your Grocery List
                </h2>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm px-3 py-1 rounded-full">
                  {groceries.length} items
                </span>
              </div>
              
              <ul className="space-y-2">
                {groceries.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeIn 0.5s ease-out forwards',
                    }}
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{item.item}</span>
                    <span className="text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full text-sm">
                      {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage